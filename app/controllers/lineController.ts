import { Line } from '../models/index.ts';
import { Response } from 'express';
import { UserRequest } from '../middlewares/jwtMidleware.ts';

const lineController = {
	async getAllActiveLines(req: UserRequest, res: Response) {
		try {
			const allActiveLines = await Line.findAll({
				where: { status: 'Attribuée' },
				include: [
					{
						association: 'agent',
						include: [{ association: 'service' }],
					},
					// {
					// 	association: 'device',
					// 	include: [{ association: 'model' }],
					// },
				],
			});
			if (!allActiveLines) {
				res.status(404).json('Aucune ligne trouvée');
			}

			res.status(200).json(allActiveLines);
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	},
};

export default lineController;
