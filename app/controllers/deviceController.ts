import { Response } from 'express';
import { UserRequest } from '../@types';
import { Agent, Device, Line, Model } from '../models';
import {
	DeviceWithModelAndAgentType,
	DevicesImportType,
} from '../@types/models';
import generateCsvFile from '../utils/csvGeneration';
import { Op } from 'sequelize';

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

			const existingDevice = await Device.findOne({
				where: {
					imei: newInfos.imei,
					id: {
						[Op.not]: id,
					},
				},
			});
			if (existingDevice)
				return res
					.status(401)
					.json('Un appareil avec cet IMEI existe déjà');

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

	async exportDevicesCsvFile(_: UserRequest, res: Response) {
		try {
			const devices = (await Device.findAll({
				include: [
					{
						association: 'agent',
						attributes: ['email'],
						include: [
							{ association: 'service', attributes: ['title'] },
						],
					},
					{
						association: 'model',
						attributes: {
							exclude: ['id'],
						},
					},
				],
			})) as DeviceWithModelAndAgentType[];

			// Formater les données pour que le fichier soit lisible
			const formattedDevices = devices.map((device) => {
				return {
					IMEI: device.imei,
					Statut: device.status,
					État: device.isNew ? 'Neuf' : 'Occasion',
					Modèle: `${device.model.brand} ${device.model.reference}${
						device.model.storage ? ` ${device.model.storage}` : ''
					}`,
					Propriétaire: device.agent?.email,
					Service: device?.agent?.service.title,
					Préparation: device?.preparationDate,
					Attribution: device?.attributionDate,
					Commentaires: device?.comments,
				};
			});

			// Création du fichier CSV
			const csv = await generateCsvFile({
				data: formattedDevices,
				fileName: 'Appareils_export',
				res,
			});

			res.status(200).send(csv);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async generateEmptyDevicesCsvFile(_: UserRequest, res: Response) {
		try {
			// Formater les données pour que le fichier soit lisible
			const headers = {
				IMEI: '',
				Statut: '',
				État: '',
				Modèle: '',
				Propriétaire: '',
				Préparation: '',
				Attribution: '',
				Commentaires: '',
			};

			// Création du fichier CSV
			const csv = await generateCsvFile({
				data: headers,
				fileName: 'Appareils_import',
				res,
			});

			res.status(200).send(csv);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async importMultipleDevices(req: UserRequest, res: Response) {
		try {
			// Appareils importés depuis le CSV
			const importedDevices: DevicesImportType = req.body;

			const models = await Model.findAll({ raw: true });
			const agents = await Agent.findAll({ raw: true });

			// Formatage des données des appareils pour insertion en BDD
			const formattedImportedDevices = importedDevices.map((device) => ({
				imei: device.IMEI,
				status: device.Statut,
				isNew: device.État.toLowerCase() === 'neuf' ? true : false,
				modelId: models.find(
					(model) =>
						model.brand.toLowerCase() +
							' ' +
							model.reference.toLowerCase() +
							(model.storage
								? ' ' + model.storage.toLowerCase()
								: '') ===
						device.Modèle.toLowerCase()
				)?.id,
				agentId: device.Propriétaire
					? agents.find(
							(agent) => agent.email === device.Propriétaire
					  )?.id
					: null,
				preparationDate: device.Préparation,
				attributionDate: device.Attribution,
				comments: device.Commentaires,
			}));

			const existingDevices = await Device.findAll({ raw: true });
			const alreadyExistingImeis: string[] = [];

			// Vérification pour chaque appareil importé qu'un appareil avec son IMEI n'est pas existant
			formattedImportedDevices.forEach((importedDevice) => {
				if (
					existingDevices.find(
						(existingDevice) =>
							existingDevice.imei === importedDevice.imei
					)
				)
					alreadyExistingImeis.push(importedDevice.imei);
			});

			// Renvoi au client des IMEI déjà présents en BDD
			if (alreadyExistingImeis.length > 0)
				return res.status(409).json(alreadyExistingImeis);

			// Ajout des appareils
			await Device.bulkCreate(formattedImportedDevices);

			res.status(200).json('ok');
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default deviceController;
