import { Response } from 'express';
import { Model, Op } from 'sequelize';
import { UserRequest } from '../types';
import {
	LineType,
	LineWithAgentAndDeviceType,
	LinesImportType,
} from '../types/models';
import { Agent, Device, History, Line } from '../models';
import generateCsvFile from '../utils/csvGeneration';
import sequelize from '../sequelize-client';
import device from '../models/device';
import { receivedDataIsAlreadyExisting } from '../utils';

const lineController = {
	async getAllLines(_: UserRequest, res: Response) {
		try {
			const lines = await Line.findAll();
			if (!lines) {
				res.status(404).json('Aucune ligne trouvée');
			}

			res.status(200).json(lines);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async getLineById(req: UserRequest, res: Response) {
		try {
			const { id } = req.params;

			const line = await Line.findByPk(id, {
				include: [
					{
						association: 'agent',
						include: [{ association: 'service' }],
					},
					{
						association: 'device',
						attributes: {
							exclude: ['agentId'],
						},
						include: [{ association: 'model' }],
					},
				],
			});
			if (!line) {
				res.status(404).json("La ligne n'existe pas");
			}

			res.status(200).json(line);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async createLine(req: UserRequest, res: Response) {
		try {
			const clientData: LineType = req.body;
			const { number } = clientData;
			const userId = req.user!.id;

			const existingLine = await Line.findOne({
				where: {
					number,
				},
			});
			if (existingLine)
				return res.status(409).json('La ligne existe déjà');

			// Transaction de création
			const transaction = await sequelize.transaction();
			try {
				const newLine = await Line.create(clientData, { transaction });
				await History.create(
					{
						operation: 'Création',
						table: 'line',
						content: `Création de la ligne ${number}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(201).json(newLine);
			} catch (error) {
				await transaction.rollback();
				throw new Error('Impossible de créer la ligne');
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateLine(req: UserRequest, res: Response) {
		try {
			const clientData = req.body;
			const { id } = req.params;
			const userId = req.user!.id;

			const line = await Line.findByPk(id);
			if (!line) return res.status(404).json("La ligne n'existe pas");

			// Si les valeurs sont identiques, pas de mise à jour en BDD
			if (receivedDataIsAlreadyExisting(line, clientData))
				return res.status(200).json(line);

			const oldNumber = line.number;
			let content = `Mise à jour de la ligne ${oldNumber}`;

			// Si le client souhaite changer le numéro, vérification si celui-ci n'est pas déjà utilisé
			if (clientData.number && clientData.number !== oldNumber) {
				const newNumber = clientData.number;
				const existingNumber = await Line.findOne({
					where: {
						number: newNumber,
						id: {
							[Op.not]: Number(id),
						},
					},
				});
				if (existingNumber)
					return res
						.status(401)
						.json('Une ligne avec ce numéro existe déjà');

				content = `Mise à jour de la ligne ${oldNumber}, incluant un changement de numéro vers ${newNumber}`;
			}

			// Transaction de mise à jour
			const transaction = await sequelize.transaction();
			try {
				const updatedLine = await line.update(clientData, {
					transaction,
				});
				await History.create(
					{
						operation: 'Modification',
						table: 'line',
						content,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(200).json(updatedLine);
			} catch (error) {
				await transaction.rollback();
				throw new Error('Impossible de mettre à jour la ligne');
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteLine(req: UserRequest, res: Response) {
		try {
			const { id } = req.params;
			const userId = req.user!.id;

			const line = await Line.findByPk(id);
			if (!line) return res.status(404).json("La ligne n'existe pas");

			// Transaction de suppression
			const transaction = await sequelize.transaction();
			try {
				await line.destroy({ transaction });
				await History.create(
					{
						operation: 'Suppression',
						table: 'line',
						content: `Suppression de la ligne avec le numéro ${line.number}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(200).json(id);
			} catch (error) {
				await transaction.rollback();
				throw new Error("Impossible de supprimer l'agent");
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async generateLinesCsvFile(_: UserRequest, res: Response) {
		try {
			const lines = (await Line.findAll({
				include: [
					{
						association: 'agent',
						attributes: ['email'],
						include: [
							{ association: 'service', attributes: ['title'] },
						],
					},
					{
						association: 'device',
						attributes: {
							exclude: ['id'],
						},
						include: [
							{
								association: 'model',
								attributes: {
									exclude: ['id'],
								},
							},
						],
					},
				],
				attributes: {
					exclude: ['id'],
				},
			})) as LineWithAgentAndDeviceType[];

			// Formater les données pour que le fichier soit lisible
			const formattedLines = lines.map((line) => {
				return {
					Numéro: line.number,
					Profil: line.profile,
					Statut: line.status,
					Propriétaire: line.agent?.email,
					Service: line.agent?.service.title,
					Appareil: line.device?.imei,
					Modèle: line.device
						? `${line.device.model.brand} ${
								line.device.model.reference
						  }${
								line.device.model.storage
									? ` ${line.device.model.storage}`
									: ''
						  }`
						: null,
					Commentaires: line?.comments,
				};
			});

			// Création du fichier CSV
			const csv = await generateCsvFile({
				data: formattedLines,
				fileName: 'Lignes_export',
				res,
			});

			res.status(200).send(csv);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async generateEmptyLinesCsvFile(_: UserRequest, res: Response) {
		try {
			// Formater les données pour que le fichier soit lisible
			const headers = {
				Numéro: '',
				Profil: '',
				Statut: '',
				Propriétaire: '',
				Appareil: '',
				Commentaires: '',
			};

			// Création du fichier CSV
			const csv = await generateCsvFile({
				data: headers,
				fileName: 'Lignes_import',
				res,
			});

			res.status(200).send(csv);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async importMultipleLines(req: UserRequest, res: Response) {
		try {
			const userId = req.user!.id;
			// Lignes importées depuis le CSV
			const importedLines: LinesImportType = req.body;

			const devices = await Device.findAll({ raw: true });
			const agents = await Agent.findAll({ raw: true });

			// Formatage des données des appareils pour insertion en BDD
			const formattedImportedLines = importedLines.map((line) => ({
				number: line.Numéro,
				profile: line.Profil,
				status: line.Statut,
				agentId: line.Propriétaire
					? agents.find((agent) => agent.email === line.Propriétaire)
							?.id
					: null,
				deviceId: line.Appareil
					? devices.find((device) => device.imei === line.Appareil)
							?.id
					: null,
				comments: line.Commentaires,
			}));

			const currentLines = await Line.findAll({ raw: true });
			const conflictItems: {
				usedNumbers: string[];
				usedDevices: string[];
				unknownDevices: string[];
				unknownAgents: string[];
			} = {
				usedNumbers: [],
				usedDevices: [],
				unknownDevices: [],
				unknownAgents: [],
			};

			// Vérification pour chaque ligne importée
			formattedImportedLines.forEach((importedLine, index) => {
				if (
					currentLines.find(
						(line) => line.number === importedLine.number
					)
				)
					conflictItems.usedNumbers.push(importedLine.number);
				if (
					importedLine.deviceId &&
					currentLines.find(
						(line) => line.deviceId === importedLine.deviceId
					)
				)
					conflictItems.usedDevices.push(
						importedLines[index].Appareil!
					);
				if (importedLine.deviceId === undefined)
					conflictItems.unknownDevices.push(
						importedLines[index].Appareil!
					);
				if (importedLine.agentId === undefined)
					conflictItems.unknownAgents.push(
						importedLines[index].Propriétaire!
					);
			});

			// Renvoi au client des conflits si existants
			if (Object.values(conflictItems).some((value) => value.length > 0))
				return res.status(409).json(conflictItems);

			// Transaction d'import
			const transaction = await sequelize.transaction();
			try {
				await Line.bulkCreate(formattedImportedLines, { transaction });
				await History.create(
					{
						operation: 'Création',
						table: 'line',
						content: 'Import de lignes via un CSV',
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
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default lineController;
