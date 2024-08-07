import { Response } from 'express';
import { UserRequest } from '../types';
import { Agent, Device, History, Model } from '../models';
import {
	DeviceWithModelAndAgentType,
	DevicesImportType,
} from '../types/models';
import generateCsvFile from '../utils/csvGeneration';
import sequelize from '../sequelize-client';
import { receivedDataIsAlreadyExisting } from '../utils';

const deviceController = {
	async getAllDevices(_: UserRequest, res: Response) {
		try {
			const devices = await Device.findAll({
				order: [['id', 'DESC']],
			});
			if (!devices) res.status(404).json('Aucune ligne trouvée');

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
					'model',
					{
						association: 'agent',
						include: ['service'],
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
			const userId = req.user!.id;

			const existingDevice = await Device.findOne({
				where: {
					imei,
				},
			});
			if (existingDevice)
				return res.status(409).json("L'appareil existe déjà");

			// Transaction de création
			const transaction = await sequelize.transaction();
			try {
				const newDevice = await Device.create(req.body, {
					transaction,
				});
				await History.create(
					{
						operation: 'Création',
						table: 'device',
						content: `Création de l'appareil ${imei}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(201).json(newDevice);
			} catch (error) {
				await transaction.rollback();
				throw new Error("Impossible de créer l'appareil");
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateDevice(req: UserRequest, res: Response) {
		try {
			const clientData = req.body;
			const { id } = req.params;
			const userId = req.user!.id;

			const device = await Device.findByPk(id);
			if (!device) return res.status(404).json("L'appareil n'existe pas");

			// Si les valeurs sont identiques, pas de mise à jour en BDD
			if (receivedDataIsAlreadyExisting(device, clientData))
				return res.status(200).json(device);

			const oldImei = device.imei;
			const newImei = clientData?.imei;
			let content = `Mise à jour de l'appareil ${oldImei}`;

			// Si le client souhaite changer l'IMEI, vérification si celui-ci n'est pas déjà utilisé
			if (newImei && newImei !== oldImei) {
				const existingDevice = await Device.findOne({
					where: {
						imei: newImei,
					},
				});
				if (existingDevice)
					return res
						.status(401)
						.json('Un appareil avec cet IMEI existe déjà');

				content = `Mise à jour de l'appareil ${oldImei}, incluant un changement d'IMEI vers ${newImei}`;
			}

			// Transaction de mise à jour
			const transaction = await sequelize.transaction();
			try {
				const updatedDevice = await device.update(clientData, {
					transaction,
				});
				await History.create(
					{
						operation: 'Modification',
						table: 'device',
						content,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(200).json(updatedDevice);
			} catch (error) {
				await transaction.rollback();
				throw new Error("Impossible de mettre à jour l'appareil");
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteDevice(req: UserRequest, res: Response) {
		try {
			const { id } = req.params;
			const userId = req.user!.id;

			const device = await Device.findByPk(id);
			if (!device) return res.status(404).json("L'appareil n'existe pas");

			// Transaction de suppression
			const transaction = await sequelize.transaction();
			try {
				await device.destroy({ transaction });
				await History.create(
					{
						operation: 'Suppression',
						table: 'device',
						content: `Suppression de l'appareil avec l'IMEI ${device.imei}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(200).json(id);
			} catch (error) {
				await transaction.rollback();
				throw new Error("Impossible de supprimer l'appareil");
			}
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
					IMEI: "'" + device.imei,
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
			const userId = req.user!.id;
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

			const currentDevices = await Device.findAll({ raw: true });
			const conflictItems: {
				existingDevices: string[];
				unknownModels: string[];
				unknownAgents: string[];
			} = {
				existingDevices: [],
				unknownModels: [],
				unknownAgents: [],
			};

			// Vérification pour chaque appareil importé qu'un appareil avec son IMEI n'est pas existant
			formattedImportedDevices.forEach((importedDevice, index) => {
				if (
					currentDevices.find(
						(device) => device.imei === importedDevice.imei
					)
				)
					conflictItems.existingDevices.push(
						importedDevices[index].IMEI
					);
				if (importedDevice.modelId === undefined)
					conflictItems.unknownModels.push(
						importedDevices[index].Modèle!
					);
				if (importedDevice.agentId === undefined)
					conflictItems.unknownAgents.push(
						importedDevices[index].Propriétaire!
					);
			});

			// Renvoi au client des IMEI déjà présents en BDD
			if (Object.values(conflictItems).some((value) => value.length > 0))
				return res.status(409).json(conflictItems);

			// Transaction d'import
			const transaction = await sequelize.transaction();
			try {
				await Device.bulkCreate(formattedImportedDevices, {
					transaction,
				});
				await History.create(
					{
						operation: 'Création',
						table: 'device',
						content: `Import d'appareils via un CSV`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(200).json('ok');
			} catch (error) {
				await transaction.rollback();
				throw new Error("Impossible de créer l'agent");
			}
			// Ajout des appareils
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default deviceController;
