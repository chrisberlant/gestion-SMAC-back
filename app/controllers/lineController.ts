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
				case 'terminated':
					status = 'Résiliée';
					break;
			}
			const allActiveLines = await Line.findAll({
				where: { status },
				include: [
					{
						association: 'agent',
						include: [{ association: 'service' }],
					},
					{
						association: 'device',
						include: [{ association: 'model' }],
					},
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
