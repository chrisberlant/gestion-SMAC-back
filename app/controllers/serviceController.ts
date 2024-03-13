import { Op } from 'sequelize';
import { UserRequest } from '../@types';
import { Service } from '../models';
import { Response } from 'express';

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
			const { title } = req.body;

			const existingService = await Service.findOne({
				where: {
					title: {
						[Op.iLike]: title,
					},
				},
			});
			if (existingService)
				return res.status(401).json('Le service existe déjà');

			const newService = await Service.create({ title });
			if (!newService) throw new Error('Impossible de créer le service');

			res.status(201).json(newService);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateService(req: UserRequest, res: Response) {
		try {
			const { id, title } = req.body;

			const service = await Service.findByPk(id);
			if (!service)
				return res.status(404).json("Le service n'existe pas");

			// Vérification si un service avec ce titre existe
			const existingService = await Service.findOne({
				where: {
					title: {
						[Op.iLike]: title,
					},
					id: {
						[Op.not]: id,
					},
				},
			});
			if (existingService)
				return res
					.status(403)
					.json('Un service possédant ce titre existe déjà');

			// Si le titre fourni est identique au titre déjà renseigné
			if (title === service.title) return res.status(200).json(service);

			const serviceIsModified = await service.update({ title });

			res.status(200).json(serviceIsModified);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteService(req: UserRequest, res: Response) {
		try {
			const { id } = req.body;

			const service = await Service.findByPk(id);
			if (!service)
				return res.status(404).json("Le service n'existe pas");

			await service.destroy();

			res.status(200).json(id);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default serviceController;
