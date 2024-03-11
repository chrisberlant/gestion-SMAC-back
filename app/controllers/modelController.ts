import { Op } from 'sequelize';
import { UserRequest } from '../middlewares/jwtMidleware';
import { Model } from '../models';
import { Response } from 'express';

const modelController = {
	async getAllModels(req: UserRequest, res: Response) {
		try {
			const models = await Model.findAll({
				order: [
					['brand', 'ASC'],
					['reference', 'ASC'],
					['storage', 'ASC'],
				],
			});

			res.status(200).json(models);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async createModel(req: UserRequest, res: Response) {
		try {
			const infos = req.body;
			const { brand, reference, storage } = infos;

			const existingModel = await Model.findOne({
				where: {
					brand: {
						[Op.iLike]: brand,
					},
					reference: {
						[Op.iLike]: reference,
					},
					storage: {
						[Op.iLike]: storage,
					},
				},
			});
			if (existingModel)
				return res.status(401).json('Le modèle existe déjà');

			const newModel = await Model.create(infos);

			if (!newModel) throw new Error('Impossible de créer le modèle');

			res.status(201).json(newModel);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateModel(req: UserRequest, res: Response) {
		try {
			const { id, ...newInfos } = req.body;

			const model = await Model.findByPk(id);
			if (!model) return res.status(404).json("Le modèle n'existe pas");

			const existingModel = await Model.findOne({
				where: {
					brand: {
						[Op.iLike]: newInfos.brand,
					},
					reference: {
						[Op.iLike]: newInfos.reference,
					},
					storage: {
						[Op.iLike]: newInfos.storage,
					},
				},
			});
			if (existingModel)
				return res.status(401).json('Le modèle existe déjà');

			const modelIsModified = await model.update(newInfos);

			res.status(200).json(modelIsModified);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteModel(req: UserRequest, res: Response) {
		try {
			const { id } = req.body;

			const model = await Model.findByPk(id);
			if (!model) return res.status(404).json("Le modèle n'existe pas");

			await model.destroy();

			res.status(200).json(id);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default modelController;
