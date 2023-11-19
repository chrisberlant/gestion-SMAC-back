import { Response } from 'express';
import { UserRequest } from '../middlewares/jwtMidleware.ts';
import { Model, User } from '../models/index.ts';
import generateRandomPassword from '../utils/passwordGeneration.ts';
import bcrypt from 'bcrypt';

const adminController = {
	async createNewUser(req: UserRequest, res: Response) {
		try {
			const infos = req.body;

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

	async modifyUserRights(req: UserRequest, res: Response) {
		try {
			const { id, isAdmin } = req.body;

			const user = await User.findByPk(id);
			if (!user)
				return res.status(404).json("L'utilisateur n'existe pas");

			await user.update({ isAdmin });

			res.status(200).json({ id, isAdmin });
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	},

	async deleteUser(req: UserRequest, res: Response) {
		try {
			const { id } = req.body;

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

	async modifyModel(req: UserRequest, res: Response) {
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
};

export default adminController;
