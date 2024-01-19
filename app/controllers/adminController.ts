import { Response } from 'express';
import { UserRequest } from '../middlewares/jwtMidleware';
import { Model, Service, User } from '../models';
import generateRandomPassword from '../utils/passwordGeneration';
import bcrypt from 'bcrypt';
import { UserType } from '../@types/models';
import { Op } from 'sequelize';

const adminController = {
	async getAllUsers(_: UserRequest, res: Response) {
		try {
			const users = await User.findAll({
				attributes: { exclude: ['password'] },
				order: [
					['isAdmin', 'DESC'],
					['lastName', 'ASC'],
				],
			});

			res.status(200).json(users);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async createUser(req: UserRequest, res: Response) {
		try {
			const infos: UserType = req.body;

			const generatedPassword = generateRandomPassword();
			const saltRounds = parseInt(process.env.SALT_ROUNDS!);
			const hashedPassword = await bcrypt.hash(
				generatedPassword,
				saltRounds
			);

			const existingUserCheck = await User.findOne({
				where: {
					email: infos.email,
				},
			});
			if (existingUserCheck)
				return res.status(409).json("L'utilisateur existe déjà");

			const userToCreate = await User.create({
				...infos,
				password: hashedPassword,
			});

			if (!userToCreate)
				throw new Error("Impossible de créer l'utilisateur");

			const { password, ...user } = userToCreate;

			res.status(201).json({ user, generatedPassword });
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateUser(req: UserRequest, res: Response) {
		try {
			const userId = req.user!.id;
			const { id, ...infosToUpdate } = req.body;

			if (id === userId)
				return res
					.status(400)
					.json(
						'Vous ne pouvez pas mettre à jour votre propre compte via cette requête'
					);
			if (id === 1)
				return res
					.status(403)
					.json(
						"Vous n'avez pas les droits pour modifier le compte de cet utilisateur"
					);

			const user = await User.findByPk(id);
			if (!user)
				return res.status(404).json("L'utilisateur n'existe pas");

			await user.update(infosToUpdate);

			const { firstName, lastName, email, isAdmin } = user;

			const newUserInfos = {
				id,
				firstName,
				lastName,
				email,
				isAdmin,
			};

			res.status(200).json(newUserInfos);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteUser(req: UserRequest, res: Response) {
		try {
			const userId = req.user!.id;
			const { id } = req.body;

			if (id === userId)
				return res
					.status(400)
					.json('Vous ne pouvez pas supprimer votre propre compte');
			if (id === 1)
				return res
					.status(403)
					.json(
						"Vous n'avez pas les droits pour supprimer le compte de cet utilisateur"
					);

			const userToDelete = await User.findByPk(id);
			if (!userToDelete)
				return res.status(404).json("L'utilisateur n'existe pas");

			await userToDelete.destroy();

			res.status(200).json(id);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async resetPassword(req: UserRequest, res: Response) {
		try {
			const userId = req.user!.id;
			const { id } = req.body;

			if (id === userId)
				return res
					.status(403)
					.json(
						'Vous ne pouvez pas réinitialiser votre propre mot de passe'
					);

			if (id === 1)
				return res
					.status(403)
					.json(
						"Vous n'avez pas les droits pour réinitialiser le mot de passe de cet utilisateur"
					);

			const generatedPassword = generateRandomPassword();
			const saltRounds = parseInt(process.env.SALT_ROUNDS!);
			const hashedPassword = await bcrypt.hash(
				generatedPassword,
				saltRounds
			);

			const user = await User.findByPk(id);
			if (!user)
				return res.status(409).json("L'utilisateur n'existe pas");

			await user.update({
				password: hashedPassword,
			});
			const { email } = user;
			const fullName = user.firstName + ' ' + user.lastName;

			res.status(201).json({ fullName, email, generatedPassword });
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

			if (!newService) throw new Error('Impossible de créer le modèle');

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

export default adminController;
