import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRequest } from '../types';
import { User } from '../models';

const authController = {
	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;

			const user = await User.findOne({
				where: { email },
			});

			if (!user)
				// If user cannot be found
				return res.status(401).json('Email ou mot de passe incorrect');

			// Hashing the password provided by the user to compare it with the one in the DB
			const passwordsMatch = await bcrypt.compare(
				password,
				user.password!
			);
			if (!passwordsMatch)
				return res.status(401).json('Email ou mot de passe incorrect');

			// We set a variable containing the token that will be sent to the browser
			const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY!, {
				expiresIn: process.env.JWT_EXPIRY,
			});

			const { firstName, lastName, role } = user;
			const loggedUser = {
				email,
				firstName,
				lastName,
				role,
			};

			res.status(200).json({ loggedUser, smac_token: token });
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async healthCheck(_: Request | UserRequest, res: Response) {
		res.status(200).json('Serveur en ligne');
	},
};

export default authController;
