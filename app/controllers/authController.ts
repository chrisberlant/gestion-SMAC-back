import { User } from '../models';
import { Request, Response } from 'express';
import { UserRequest } from '../middlewares/jwtMidleware';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const authController = {
	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const lowerCaseEmail = email.toLowerCase();

			const user = await User.findOne({
				where: { email: lowerCaseEmail },
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
				expiresIn: '10h',
			});

			// Send the JWT as cookie
			res.cookie('smac_token', token, {
				httpOnly: true,
				sameSite: true,
				domain: process.env.CLIENT_URL,
			});

			const { firstName, lastName, isAdmin } = user;
			const loggedUser = {
				email: lowerCaseEmail,
				firstName,
				lastName,
				isAdmin,
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
			const { email, password, isAdmin } = userToRegister;
			let parsedIsAdmin = 'false';
			if (isAdmin) parsedIsAdmin = 'true';

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
				isAdmin: parsedIsAdmin,
			});
			if (!user) throw new Error("Impossible de créer l'utilisateur");

			res.status(201).json('Le compte a été créé');
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async logout(req: UserRequest, res: Response) {
		res.clearCookie('smac_token');
		res.status(200).json('Déconnexion effectuée');
	},
};

export default authController;
