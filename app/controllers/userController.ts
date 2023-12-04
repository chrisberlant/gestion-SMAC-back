import { User } from '../models';
import { Response } from 'express';
import { UserRequest } from '../middlewares/jwtMidleware';

import bcrypt from 'bcrypt';

const userController = {
	async getCurrentUser(req: UserRequest, res: Response) {
		try {
			const userId = req.user!.id;

			const user = await User.findByPk(userId, {
				attributes: {
					exclude: ['id', 'password'],
				},
			});
			if (!user)
				return res
					.clearCookie('smac_token')
					.status(404)
					.json('Utilisateur introuvable');

			res.status(200).json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async modifyCurrentUser(req: UserRequest, res: Response) {
		try {
			const userId = req.user!.id;
			const infosToModify = req.body;

			const user = await User.findByPk(userId);
			if (!user)
				return res
					.clearCookie('smac_token')
					.status(404)
					.json("L'utilisateur n'existe pas");

			await user.update(infosToModify);

			const { firstName, lastName, email } = user;
			const newUserInfos = {
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

	async modifyCurrentUserPassword(req: UserRequest, res: Response) {
		try {
			const userId = req.user!.id;
			const { oldPassword, newPassword } = req.body;

			const user = await User.findByPk(userId);
			if (!user)
				return res
					.status(404)
					.clearCookie('smac_token')
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
};

export default userController;
