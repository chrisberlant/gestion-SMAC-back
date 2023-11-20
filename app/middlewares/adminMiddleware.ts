import { NextFunction, Response } from 'express';
import { User } from '../models';
import { UserRequest } from './jwtMidleware';

const adminMiddleware = async (
	req: UserRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user!.id;
		const user = await User.findByPk(userId, {
			attributes: ['isAdmin'],
		});

		if (!user) return res.status(404).json('Utilisateur introuvable');

		if (!user.isAdmin)
			return res
				.status(403)
				.json("Vous n'avez pas les droits nécessaires");
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json(error);
	}
};

export default adminMiddleware;
