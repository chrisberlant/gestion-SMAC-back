import { Response } from 'express';
import { History, User } from '../models';
import { UserRequest } from '../@types';
import { UserType } from '../@types/models';
import bcrypt from 'bcrypt';
import generateRandomPassword from '../utils/passwordGeneration';
import { Op } from 'sequelize';
import sequelize from '../sequelize-client';

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
			const clientData = req.body;

			const user = await User.findByPk(userId);
			if (!user)
				return res.status(404).json("L'utilisateur n'existe pas");

			const existingEmail = await User.findOne({
				where: {
					email: clientData.email,
					id: {
						[Op.not]: Number(userId),
					},
				},
			});
			if (existingEmail)
				return res
					.status(409)
					.json(
						'Un autre utilisateur possède déjà cette adresse mail'
					);

			const { id, firstName, lastName, email } = user;
			const newUserInfos = {
				id,
				firstName,
				lastName,
				email,
			};

			// Transaction de mise à jour
			const transaction = await sequelize.transaction();
			try {
				const oldEmail = user.email;
				const newEmail = clientData.email;
				let emailChanged = null;
				// Si l'email a été modifié
				if (oldEmail !== newEmail)
					emailChanged = `Mise à jour de l'utilisateur ${oldEmail}, incluant un changement d'email vers ${newEmail}`;

				await user.update(clientData, {
					transaction,
				});
				await History.create(
					{
						operation: 'Update',
						table: 'user',
						content:
							emailChanged ??
							`Mise à jour de l'utilisateur ${oldEmail}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(200).json(newUserInfos);
			} catch (error) {
				await transaction.rollback();
				throw new Error("Impossible de mettre à jour l'utilisateur");
			}
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
			const clientData: UserType = req.body;
			const { email } = clientData;
			const userId = req.user!.id;

			// Vérification si un utilisateur avec cette adresse mail existe
			const existingEmail = await User.findOne({
				where: {
					email,
				},
			});
			if (existingEmail)
				return res.status(409).json("L'utilisateur existe déjà");
			// Transaction de création
			const transaction = await sequelize.transaction();
			try {
				// Génération d'un mdp aléatoire
				const generatedPassword = generateRandomPassword();
				const saltRounds = parseInt(process.env.SALT_ROUNDS!);
				const hashedPassword = await bcrypt.hash(
					generatedPassword,
					saltRounds
				);

				const userCreated = await User.create({
					...clientData,
					password: hashedPassword,
				});
				await History.create(
					{
						operation: 'Create',
						table: 'user',
						content: `Création de l'utilisateur ${email}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				// Retrait du mdp de l'objet à renvoyer au client
				const { password, ...user } = userCreated.get();

				res.status(201).json({ user, generatedPassword });
			} catch (error) {
				await transaction.rollback();
				throw new Error("Impossible de créer l'utilisateur");
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateUser(req: UserRequest, res: Response) {
		try {
			const clientData = req.body;
			const { id } = req.params;
			const userId = req.user!.id;

			if (id === userId)
				return res
					.status(400)
					.json(
						'Vous ne pouvez pas mettre à jour votre propre compte via cette requête'
					);
			if (id === '1')
				return res
					.status(403)
					.json(
						"Vous n'avez pas les droits pour modifier le compte de cet utilisateur"
					);

			const user = await User.findByPk(id);
			if (!user)
				return res.status(404).json("L'utilisateur n'existe pas");

			const oldEmail = user.email;
			let content = `Mise à jour de l'utilisateur ${oldEmail}`;

			// Si le client souhaite changer l'email, vérification si un utilisateur avec celui-ci existe
			if (clientData.email && clientData.email !== oldEmail) {
				const newEmail = clientData.email;
				const existingEmail = await User.findOne({
					where: {
						email: newEmail,
						id: {
							[Op.not]: Number(id),
						},
					},
				});
				if (existingEmail)
					return res
						.status(409)
						.json(
							'Un autre utilisateur possède déjà cette adresse mail'
						);

				content = `Mise à jour de l'utilisateur ${oldEmail}, incluant un changement d'email vers ${newEmail}`;
			}

			// Transaction de mise à jour
			const transaction = await sequelize.transaction();
			try {
				const updatedUser = await user.update(clientData, {
					transaction,
				});
				await History.create(
					{
						operation: 'Update',
						table: 'user',
						content,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				// Informations à renvoyer au client
				const { password, ...newUserInfos } = updatedUser.dataValues;

				res.status(200).json(newUserInfos);
			} catch (error) {
				await transaction.rollback();
				throw new Error("Impossible de mettre à jour l'utilisateur");
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async resetPassword(req: UserRequest, res: Response) {
		try {
			const userId = req.user!.id;
			const { id } = req.params;

			if (id === userId)
				return res
					.status(403)
					.json(
						'Vous ne pouvez pas réinitialiser votre propre mot de passe'
					);

			if (id === '1')
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

			// Transaction réinitialisation de mot de passe
			const transaction = await sequelize.transaction();
			try {
				await user.update(
					{
						password: hashedPassword,
					},
					{ transaction }
				);
				await History.create(
					{
						operation: 'Update',
						table: 'user',
						content: `Réinitialisation du mot de passe de l'utilisateur ${user.email}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				// Informations à renvoyer au client
				const { email } = user;
				const fullName = user.firstName + ' ' + user.lastName;

				res.status(200).json({ fullName, email, generatedPassword });
			} catch (error) {
				await transaction.rollback();
				throw new Error(
					"Impossible de réinitialiser le mot de passe de l'utilisateur"
				);
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteUser(req: UserRequest, res: Response) {
		try {
			const userId = req.user!.id;
			const { id } = req.params;

			if (id === userId)
				return res
					.status(400)
					.json('Vous ne pouvez pas supprimer votre propre compte');
			if (id === '1')
				return res
					.status(403)
					.json(
						"Vous n'avez pas les droits pour supprimer le compte de cet utilisateur"
					);

			const user = await User.findByPk(id);
			if (!user)
				return res.status(404).json("L'utilisateur n'existe pas");

			// Transaction de suppression
			const transaction = await sequelize.transaction();
			try {
				await user.destroy({ transaction });
				await History.create(
					{
						operation: 'Delete',
						table: 'user',
						content: `Suppression de l'utilisateur ${user.email}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(200).json(id);
			} catch (error) {
				await transaction.rollback();
				throw new Error("Impossible de supprimer l'utilisateur");
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default userController;
