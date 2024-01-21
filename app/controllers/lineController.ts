import { Response } from 'express';
import { Op } from 'sequelize';
import { LineType } from '../@types/models';
import { UserRequest } from '../middlewares/jwtMidleware';
import { Line } from '../models';

const lineController = {
	async getAllLines(_: UserRequest, res: Response) {
		try {
			const lines = await Line.findAll({
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
				res.status(404).json('Aucune ligne trouvée');
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
			const { number } = infos;

			const existingLine = await Line.findOne({
				where: {
					number: {
						[Op.iLike]: number,
					},
				},
			});
			if (existingLine)
				return res.status(401).json('La ligne existe déjà');

			const newLine = await Line.create(infos);

			if (!newLine) throw new Error('Impossible de créer la ligne');

			res.status(201).json(newLine);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateLine(req: UserRequest, res: Response) {
		try {
			const { id, ...newInfos } = req.body;

			const line = await Line.findByPk(id);
			if (!line) return res.status(404).json("La ligne n'existe pas");

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
