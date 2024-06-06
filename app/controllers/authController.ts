import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRequest } from '../types';
import { User } from '../models';
import generateRandomPassword from '../utils/passwordGeneration';
import { randomInt } from 'crypto';
import demoUsers from '../utils/demoUsers';
import sequelize from '../sequelize-client';
import fs from 'fs';
import path from 'path';

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

	async demo(_: Request, res: Response) {
		try {
			const generatedPassword = generateRandomPassword();
			const randomIndex = randomInt(0, 19);
			const generatedUserInfos = demoUsers[randomIndex];
			const saltRounds = parseInt(process.env.SALT_ROUNDS!);
			const hashedPassword = await bcrypt.hash(
				generatedPassword,
				saltRounds
			);

			// Réinitialisation de la BDD à chaque test de la démo
			const tablesCreationFile = path.join(
				process.cwd(),
				'db_creation',
				'insert_tables.sql'
			);
			const dataInsertFile = path.join(
				process.cwd(),
				'db_creation',
				'insert_data.sql'
			);
			const tablesCreationQuery = fs.readFileSync(
				tablesCreationFile,
				'utf8'
			);
			const dataInsertQuery = fs.readFileSync(dataInsertFile, 'utf8');
			const tablesCreation = await sequelize.query(tablesCreationQuery);
			if (!tablesCreation)
				throw new Error(
					'Impossible de créer les tables de la base de données'
				);
			const dataInsert = await sequelize.query(dataInsertQuery);
			if (!dataInsert)
				throw new Error(
					"Impossible d'insérer les données fictives dans la base de données"
				);

			const user = await User.create({
				...generatedUserInfos,
				password: hashedPassword,
			});
			if (!user) throw new Error("Impossible de créer l'utilisateur");

			const generatedUser = {
				email: user.email,
				password: generatedPassword,
			};

			res.status(200).json(generatedUser);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async healthCheck(_: Request | UserRequest, res: Response) {
		res.status(200).json('Serveur de démonstration en ligne');
	},
};

export default authController;
