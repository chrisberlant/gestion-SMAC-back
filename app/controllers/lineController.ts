import { Response } from 'express';
import { Op } from 'sequelize';
import { LineType } from '../@types/models';
import { UserRequest } from '../middlewares/jwtMidleware';
import { Device, Line } from '../models';
import sequelize from '../sequelize-client';

const lineController = {
	async getAllLines(_: UserRequest, res: Response) {
		try {
			const lines = await Line.findAll({
				order: [['id', 'DESC']],
			});
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
			const infos: LineType = req.body;
			const { number, deviceId, agentId } = infos;
			const lineCreationTransaction = await sequelize.transaction();

			const existingLine = await Line.findOne({
				where: {
					number,
				},
			});
			if (existingLine)
				return res.status(401).json('La ligne existe déjà');

			try {
				// Si un appareil est fourni, étapes supplémentaires à effectuer avant de créer la ligne
				if (deviceId) {
					const device = await Device.findByPk(deviceId, {
						transaction: lineCreationTransaction,
					});
					if (!device) throw new Error("L'appareil n'existe pas");

					// Si le propriétaire fourni est différent de l'actuel
					if (device.agentId !== agentId) {
						// Mise à jour du propriétaire de l'appareil
						await device.update(
							{ agentId },
							{ transaction: lineCreationTransaction }
						);
					}

					// Mise à jour de la ligne déjà associée à cet appareil (si existante) pour l'y désaffecter
					const line = await Line.findOne({
						where: {
							deviceId,
						},
						transaction: lineCreationTransaction,
					});
					line?.update(
						{ deviceId: null },
						{ transaction: lineCreationTransaction }
					);
				}

				const newLine = await Line.create(infos, {
					transaction: lineCreationTransaction,
				});

				await lineCreationTransaction.commit();
				res.status(201).json(newLine);
			} catch (error) {
				await lineCreationTransaction.rollback(); // Annuler la transaction
				throw new Error('Impossible de créer la ligne');
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateLine(req: UserRequest, res: Response) {
		try {
			const { id, ...newInfos } = req.body;
			const { deviceId, agentId } = newInfos;

			const line = await Line.findByPk(id);
			if (!line) return res.status(404).json("La ligne n'existe pas");

			// Si l'appareil a été modifié, vérification de son utilisateur actuel
			if (deviceId !== line.deviceId) {
				const device = await Device.findByPk(deviceId);
				if (!device)
					return res.status(404).json("L'appareil n'existe pas");

				// Si le propriétaire a été modifié
				if (device.agentId !== agentId)
					await device.update({ agentId });
			}

			const lineIsModified = await line.update(newInfos);

			res.status(200).json(lineIsModified);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteLine(req: UserRequest, res: Response) {
		try {
			const { id } = req.body;

			const line = await Line.findByPk(id);
			if (!line) return res.status(404).json("La ligne n'existe pas");

			await line.destroy();

			res.status(200).json(id);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default lineController;
