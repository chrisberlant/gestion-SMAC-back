import { ModelType } from '../@types/models';
import { UserRequest } from '../middlewares/jwtMidleware';
import { Model } from '../models';
import { Response } from 'express';

const modelController = {
	async getAllModels(req: UserRequest, res: Response) {
		try {
			const models: ModelType[] = await Model.findAll({
				order: [
					['brand', 'ASC'],
					['reference', 'ASC'],
				],
			});

			res.status(200).json(models);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default modelController;
