import { User } from '../models';
import { Request, Response } from 'express';
import { UserRequest } from '../middlewares/jwtMidleware';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const authController = {
	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;

			const userSearched = await User.findOne({
				where: { email: email.toLowerCase() },
				attributes: { exclude: ['isAdmin'] },
			});

			if (!userSearched)
				// If user cannot be found
				return res.status(401).json('Email ou mot de passe incorrect');

			// Hashing the password provided by the user to compare it with the one in the DB
			const passwordsMatch = await bcrypt.compare(
				password,
				userSearched.password!
			);
			if (!passwordsMatch)
				return res.status(401).json('Email ou mot de passe incorrect');

			const id = userSearched.id;

			const user = userSearched.get({ plain: true }); // Create a copy of the sequelize object with only the infos needed
			delete user.password; // Removing the password before using the object
			delete user.id;

			// We set a variable containing the token that will be sent to the browser
			const token = jwt.sign({ id }, process.env.SECRET_KEY!, {
				expiresIn: '6h',
			});

			// Send the JWT as cookie
			res.cookie('smac_token', token, {
				httpOnly: true,
				sameSite: true,
			});
			res.status(200).json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
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
			res.status(500).json(error);
		}
	},

	async logout(req: UserRequest, res: Response) {
		res.clearCookie('smac_token');
		res.status(200).json('Déconnexion effectuée');
	},
};

export default authController;
