import { Response } from 'express';
import { UserRequest } from '../middlewares/jwtMidleware.ts';
import { User } from '../models/index.ts';
import generateRandomPassword from '../utils/passwordGeneration.ts';
import bcrypt from 'bcrypt';

const adminController = {
	async createNewUser(req: UserRequest, res: Response) {
		try {
			const infos = req.body;
			console.log('Entrée dans le contrôleur');

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
				return res.status(401).json("L'utilisateur existe déjà");

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
};

export default adminController;
