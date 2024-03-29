import { Response } from 'express';
import { User } from '../models';
import { UserRequest } from '../@types';
import { UserType } from '../@types/models';
import bcrypt from 'bcrypt';
import generateRandomPassword from '../utils/passwordGeneration';
import { Op } from 'sequelize';

const userController = {
	async getCurrentUser(req: UserRequest, res: Response) {
		try {
			const userId = req.user!.id;

			const user = await User.findByPk(userId, {
				attributes: {
					exclude: ['id', 'password'],
				},
			});
			if (!user) return res.status(404).json('Utilisateur introuvable');

			res.status(200).json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateCurrentUser(req: UserRequest, res: Response) {
		try {
			const userId = req.user!.id;
			const infosToUpdate = req.body;

			const user = await User.findByPk(userId);
			if (!user)
				return res.status(404).json("L'utilisateur n'existe pas");

			const existingEmailCheck = await User.findOne({
				where: {
					email: infosToUpdate.email,
					id: {
						[Op.not]: userId,
					},
				},
			});
			if (existingEmailCheck)
				return res
					.status(409)
					.json(
						'Un autre utilisateur possède déjà cette adresse mail'
					);

			await user.update(infosToUpdate);

			const { id, firstName, lastName, email } = user;
			const newUserInfos = {
				id,
				firstName,
				lastName,
				email,
			};

			res.status(200).json(newUserInfos);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateCurrentUserPassword(req: UserRequest, res: Response) {
		try {
			const userId = req.user!.id;
			const { oldPassword, newPassword } = req.body;

			const user = await User.findByPk(userId);
			if (!user)
				return res
					.status(404)
					.json("Impossible de trouver l'utilisateur dans la base");

			const passwordsMatch = await bcrypt.compare(
				oldPassword,
				user.password!
			);
			if (!passwordsMatch)
				return res.status(401).json('Ancien mot de passe incorrect');

			const saltRounds = parseInt(process.env.SALT_ROUNDS!);
			const newHashedPassword = await bcrypt.hash(
				newPassword,
				saltRounds
			);

			await user.update({
				password: newHashedPassword,
			});

			res.status(200).json('Mot de passe changé.');
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async getAllUsers(_: UserRequest, res: Response) {
		try {
			const users = await User.findAll({
				attributes: { exclude: ['password'] },
				order: [
					['role', 'ASC'],
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

			// Vérification si un utilisateur avec cette adresse mail existe
			const existingUserCheck = await User.findOne({
				where: {
					email: infos.email,
				},
			});
			if (existingUserCheck)
				return res.status(409).json("L'utilisateur existe déjà");

			const userCreated = await User.create({
				...infos,
				password: hashedPassword,
			});

			if (!userCreated)
				throw new Error("Impossible de créer l'utilisateur");

			const { password, ...user } = userCreated.get();

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

			// Vérification si un utilisateur avec cette adresse mail existe
			const existingEmailCheck = await User.findOne({
				where: {
					email: infosToUpdate.email,
					id: {
						[Op.not]: id,
					},
				},
			});
			if (existingEmailCheck)
				return res
					.status(409)
					.json(
						'Un autre utilisateur possède déjà cette adresse mail'
					);

			await user.update(infosToUpdate);

			const { firstName, lastName, email, role } = user;

			const newUserInfos = {
				id,
				firstName,
				lastName,
				email,
				role,
			};

			res.status(200).json(newUserInfos);
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

			res.status(200).json({ fullName, email, generatedPassword });
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
};

export default userController;
