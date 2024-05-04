import { Op } from 'sequelize';
import { UserRequest } from '../types';
import { History, Service } from '../models';
import { Response } from 'express';
import { ServiceType } from '../types/models';
import sequelize from '../sequelize-client';

const serviceController = {
	async getAllServices(_: UserRequest, res: Response) {
		try {
			const services = await Service.findAll({
				order: ['title'],
			});

			res.status(200).json(services);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async createService(req: UserRequest, res: Response) {
		try {
			const clientData: ServiceType = req.body;
			const { title } = clientData;
			const userId = req.user!.id;

			const existingService = await Service.findOne({
				where: {
					title: {
						[Op.iLike]: title,
					},
				},
			});
			if (existingService)
				return res.status(401).json('Le service existe déjà');

			// Transaction de création
			const transaction = await sequelize.transaction();
			try {
				const newService = await Service.create(clientData, {
					transaction,
				});
				await History.create(
					{
						operation: 'Création',
						table: 'service',
						content: `Création du service ${title}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(201).json(newService);
			} catch (error) {
				await transaction.rollback();
				throw new Error('Impossible de créer le service');
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateService(req: UserRequest, res: Response) {
		try {
			const clientData: ServiceType = req.body;
			const { id } = req.params;
			const userId = req.user!.id;

			const service = await Service.findByPk(id);
			if (!service)
				return res.status(404).json("Le service n'existe pas");

			// Si le titre fourni est identique au titre déjà renseigné
			if (clientData.title === service.title)
				return res.status(200).json(service);

			// Vérification si un service avec ce titre existe
			const existingService = await Service.findOne({
				where: {
					title: {
						[Op.iLike]: clientData.title,
					},
					id: {
						[Op.not]: Number(id),
					},
				},
			});
			if (existingService)
				return res.status(409).json('Le service existe déjà');

			// Transaction de mise à jour
			const transaction = await sequelize.transaction();
			try {
				const updatedService = await service.update(clientData, {
					transaction,
				});
				await History.create(
					{
						operation: 'Modification',
						table: 'service',
						content: `Changement de nom du service ${service.title} vers ${clientData.title}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(200).json(updatedService);
			} catch (error) {
				await transaction.rollback();
				throw new Error('Impossible de mettre à jour le service');
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteService(req: UserRequest, res: Response) {
		try {
			const { id } = req.params;
			const userId = req.user!.id;

			const service = await Service.findByPk(id);
			if (!service)
				return res.status(404).json("Le service n'existe pas");

			// Transaction de suppression
			const transaction = await sequelize.transaction();
			try {
				await service.destroy({ transaction });
				await History.create(
					{
						operation: 'Suppression',
						table: 'service',
						content: `Suppression du service ${service.title}`,
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
};

export default serviceController;
