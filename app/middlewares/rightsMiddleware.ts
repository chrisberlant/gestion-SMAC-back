import { NextFunction, Response } from 'express';
import { User } from '../models';
import { RoleType, UserRequest } from '../types';

const rightsMiddleware =
	(requiredRole: RoleType) =>
	async (req: UserRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req.user!.id;
			const user = await User.findByPk(userId, {
				attributes: ['role'],
			});

			if (!user) return res.status(404).json('Utilisateur introuvable');

			// Un admin peut accéder aux routes autorisées pour les tech
			if (
				(requiredRole === 'Tech' &&
					user.role !== 'Tech' &&
					user.role !== 'Admin') ||
				(requiredRole === 'Admin' && user.role !== 'Admin')
			)
				return res
					.status(403)
					.json("Vous n'avez pas les droits nécessaires");

			next();
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	};

export default rightsMiddleware;
