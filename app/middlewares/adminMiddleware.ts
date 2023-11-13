import { NextFunction, Response } from 'express';
import { UserRequest } from './jwtMidleware.ts';
import { User } from '../models/index.ts';

const adminMiddleware = async (
	req: UserRequest,
	res: Response,
	next: NextFunction
) => {
	const userId = req.user!.id;
	const user = await User.findByPk(userId);

	if (user) {
		if (user?.isAdmin) next();
		return res.status(403).json("Vous n'avez pas les droits nécessaires");
	}
	return res.status(404).json('Utilisateur introuvable');
};

export default adminMiddleware;
