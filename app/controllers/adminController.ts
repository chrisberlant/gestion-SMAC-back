import { Response } from 'express';
import { UserRequest } from '../middlewares/jwtMidleware';
import { Model, Service, User } from '../models';
import generateRandomPassword from '../utils/passwordGeneration';
import bcrypt from 'bcrypt';
import { UserType } from '../@types/models';

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
			res.status(500).json(error);
		}
	},

	async createNewUser(req: UserRequest, res: Response) {
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

			const user = await User.create({
				...infos,
				password: hashedPassword,
			});

			if (!user) throw new Error("Impossible de créer l'utilisateur");

			res.status(201).json({ user, generatedPassword });
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
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
			res.status(500).json(error);
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

			const userToDelete = await User.findByPk(id);
			if (!userToDelete)
				return res.status(404).json("L'utilisateur n'existe pas");

			await userToDelete.destroy();

			res.status(200).json(id);
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	},

	async createNewModel(req: UserRequest, res: Response) {
		try {
			const infos = req.body;
			const { brand, reference, storage } = infos;

			const existingModel = await Model.findOne({
				where: {
					reference,
					brand,
					storage,
				},
			});
			if (existingModel)
				return res.status(401).json('Le modèle existe déjà');

			const newModel = await Model.create(infos);

			if (!newModel) throw new Error('Impossible de créer le modèle');

			res.status(201).json(newModel);
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
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
			res.status(500).json(error);
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
			res.status(500).json(error);
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
			res.status(500).json(error);
		}
	},
};

export default adminController;
