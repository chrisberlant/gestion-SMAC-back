import { Line } from '../models';
import { Response } from 'express';
import { UserRequest } from '../middlewares/jwtMidleware';

const lineController = {
	async getAllLines(req: UserRequest, res: Response) {
		try {
			let status = '';
			switch (req.params.status) {
				case 'attributed':
					status = 'Attribuée';
					break;
				case 'in-progress':
					status = 'En cours';
					break;
				case 'resiliated':
					status = 'Résiliée';
					break;
				default:
					status = 'Attribuée';
			}

			console.log(status);
			const lines = await Line.findAll({
				where: { status },
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
			res.status(500).json(error);
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
			res.status(500).json(error);
		}
	},
};

export default lineController;
