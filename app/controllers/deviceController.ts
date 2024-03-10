import { Response } from 'express';
import { UserRequest } from '../middlewares/jwtMidleware';
import { Device, Line } from '../models';
import { DeviceWithModelAndAgentType } from '../@types/models';
import { AsyncParser } from '@json2csv/node';
import fs from 'fs';

const deviceController = {
	async getAllDevices(_: UserRequest, res: Response) {
		try {
			const devices = await Device.findAll({
				order: [['id', 'DESC']],
			});
			if (!devices) {
				res.status(404).json('Aucune ligne trouvée');
			}

			res.status(200).json(devices);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async getDeviceById(req: UserRequest, res: Response) {
		try {
			const { id } = req.params;

			const device = await Device.findByPk(id, {
				include: [
					{
						association: 'model',
					},
					{
						association: 'agent',
						include: [{ association: 'service' }],
					},
				],
			});
			if (!device) {
				res.status(404).json("L'appareil n'existe pas");
			}

			res.status(200).json(device);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async createDevice(req: UserRequest, res: Response) {
		try {
			const { imei } = req.body;

			const existingDevice = await Device.findOne({
				where: {
					imei,
				},
			});
			if (existingDevice)
				return res.status(401).json("L'appareil existe déjà");

			const newDevice = await Device.create(req.body);

			if (!newDevice) throw new Error("Impossible de créer l'appareil");

			res.status(201).json(newDevice);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateDevice(req: UserRequest, res: Response) {
		try {
			const { id, ...newInfos } = req.body;

			const device = await Device.findByPk(id);
			if (!device) return res.status(404).json("L'appareil n'existe pas");

			const deviceIsModified = await device.update(newInfos);

			res.status(200).json(deviceIsModified);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteDevice(req: UserRequest, res: Response) {
		try {
			const { id } = req.body;

			const device = await Device.findByPk(id);
			if (!device) return res.status(404).json("L'appareil n'existe pas");

			const associatedLine = await Line.findOne({
				where: {
					deviceId: id,
				},
			});
			if (associatedLine)
				return res
					.status(409)
					.json("L'appareil est associé à une ligne");

			await device.destroy();

			res.status(200).json(id);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async generateDevicesCsvFile(_: UserRequest, res: Response) {
		try {
			const devices = (await Device.findAll({
				include: [
					{
						association: 'agent',
						include: [{ association: 'service' }],
					},
					{
						association: 'model',
					},
				],
			})) as DeviceWithModelAndAgentType[];

			// Formater les données pour que le fichier soit lisible
			const formattedDevices = devices.map((device) => {
				return {
					IMEI: device.imei,
					Statut: device.status,
					Etat: device.isNew ? 'Neuf' : 'Occasion',
					Modele: `${device.model.brand} ${device.model.reference}${
						device.model.storage ? ` ${device.model.storage}` : ''
					}`,
					Proprietaire: device.agent?.email,
					Service: device?.agent?.service.title,
					Preparation: device?.preparationDate,
					Attribution: device?.attributionDate,
					Commentaires: device?.comments,
				};
			});

			// Création du contenu CSV à partir des données
			const parser = new AsyncParser({ delimiter: ';' });
			const csv = await parser.parse(formattedDevices).promise();

			// Détails du fichier
			const fileName = `Appareils_export_${Date.now()}`;
			const filePath = `./exports/${fileName}.csv`;

			// Enregistrer le fichier dans le dossier exports
			fs.writeFile(filePath, csv, (err) => {
				if (err) throw err;
				res.setHeader(
					'Access-Control-Expose-Headers',
					'Content-Disposition'
				);
				res.setHeader(
					'Content-Disposition',
					`attachment; filename=${fileName}`
				);

				res.status(200).download(filePath);
			});
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default deviceController;
