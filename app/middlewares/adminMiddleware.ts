import { NextFunction, Response } from 'express';
import { User } from '../models/index.ts';
import { UserRequest } from './jwtMidleware.ts';

const adminMiddleware = async (
	req: UserRequest,
	res: Response,
	next: NextFunction
) => {
	const userId = req.user!.id;
	const user = await User.findByPk(userId);

	if (!user) return res.status(404).json('Utilisateur introuvable');

	if (!user.isAdmin)
		return res.status(403).json("Vous n'avez pas les droits nécessaires");
	next();
};

export default adminMiddleware;
