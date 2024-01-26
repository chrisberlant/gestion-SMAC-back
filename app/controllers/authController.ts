import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRequest } from '../middlewares/jwtMidleware';
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
				expiresIn: '12h',
			});

			// Send the JWT as cookie
			res.cookie('smac_token', token, {
				httpOnly: true,
				sameSite: 'none',
				secure: true,
			});

			const { firstName, lastName, role } = user;
			const loggedUser = {
				email,
				firstName,
				lastName,
				role,
			};

			res.status(200).json(loggedUser);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async register(req: Request, res: Response) {
		try {
			const userToRegister = req.body;
			const { email, password } = userToRegister;

			const alreadyExistingUser = await User.findOne({
				where: { email },
			});
			if (alreadyExistingUser)
				return res.status(401).json("Une erreur s'est produite");

			const saltRounds = parseInt(process.env.SALT_ROUNDS!);
			const hashedPassword = await bcrypt.hash(password, saltRounds); // Hashing the password provided by the user

			const user = await User.create({
				...userToRegister,
				password: hashedPassword,
			});
			if (!user) throw new Error("Impossible de créer l'utilisateur");

			res.status(201).json('Le compte a été créé');
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async logout(_: UserRequest, res: Response) {
		res.clearCookie('smac_token');
		res.status(200).json('Déconnexion effectuée');
	},

	async healthCheck(_: Request | UserRequest, res: Response) {
		res.status(200).json('Serveur en ligne');
	},
};

export default authController;
