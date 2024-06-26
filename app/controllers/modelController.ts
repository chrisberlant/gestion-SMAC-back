import { Op } from 'sequelize';
import { UserRequest } from '../types';
import { Model, History } from '../models';
import { Response } from 'express';
import sequelize from '../sequelize-client';
import { receivedDataIsAlreadyExisting } from '../utils';

const modelController = {
	async getAllModels(_: UserRequest, res: Response) {
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
			const clientData = req.body;
			const userId = req.user!.id;
			const { brand, reference, storage } = clientData;

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
				return res.status(409).json('Le modèle existe déjà');

			// Transaction de création
			const transaction = await sequelize.transaction();
			try {
				const value = `${brand} ${reference}${
					storage ? ` ${storage}` : ''
				}`;

				const newModel = await Model.create(clientData, {
					transaction,
				});
				await History.create(
					{
						operation: 'Création',
						table: 'model',
						content: `Création de ${value}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(201).json(newModel);
			} catch (error) {
				await transaction.rollback();
				throw new Error('Impossible de créer le modèle');
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateModel(req: UserRequest, res: Response) {
		try {
			const clientData = req.body;
			const { id } = req.params;
			const userId = req.user!.id;

			const model = await Model.findByPk(id);
			if (!model) return res.status(404).json("Le modèle n'existe pas");

			// Si les valeurs sont identiques, pas de mise à jour en BDD
			if (receivedDataIsAlreadyExisting(model, clientData))
				return res.status(200).json(model);

			// Recherche si un modèle parfaitement identique existe déjà
			const existingModel = await Model.findOne({
				where: {
					brand: {
						[Op.iLike]: clientData.brand,
					},
					reference: {
						[Op.iLike]: clientData.reference,
					},
					storage: {
						[Op.iLike]: clientData.storage,
					},
					id: {
						[Op.not]: Number(id),
					},
				},
			});
			if (existingModel)
				return res.status(409).json('Le modèle existe déjà');

			// Transaction de mise à jour
			const transaction = await sequelize.transaction();
			try {
				const oldValue = `${model.brand} ${model.reference}${
					model.storage ? ` ${model.storage}` : ''
				}`;
				const updatedModel = await model.update(clientData, {
					transaction,
				});
				const newValue = `${updatedModel.brand} ${
					updatedModel.reference
				}${updatedModel.storage ? ` ${updatedModel.storage}` : ''}`;

				await History.create(
					{
						operation: 'Modification',
						table: 'model',
						content: `Mise à jour de ${oldValue} vers ${newValue}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(200).json(updatedModel);
			} catch (error) {
				await transaction.rollback();
				throw new Error('Impossible de mettre à jour le modèle');
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteModel(req: UserRequest, res: Response) {
		try {
			const { id } = req.params;
			const userId = req.user!.id;

			const model = await Model.findByPk(id);
			if (!model) return res.status(404).json("Le modèle n'existe pas");

			// Transaction de suppression
			const transaction = await sequelize.transaction();
			try {
				const value = `${model.brand} ${model.reference}${
					model.storage ? ` ${model.storage}` : ''
				}`;
				await model.destroy({
					transaction,
				});
				await History.create(
					{
						operation: 'Suppression',
						table: 'model',
						content: `Suppression du modèle ${value}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(200).json(id);
			} catch (error) {
				await transaction.rollback();
				throw new Error('Impossible de supprimer le modèle');
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default modelController;
