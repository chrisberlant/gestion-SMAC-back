import { Response } from 'express';
import { UserRequest } from '../types';
import { History } from '../models';
import { Op } from 'sequelize';

const historyController = {
	async getAllHistory(_: UserRequest, res: Response) {
		try {
			const fullHistory = await History.findAll({
				order: [['id', 'DESC']],
			});
			if (!fullHistory) {
				res.status(404).json('Aucun historique trouvé');
			}

			res.status(200).json(fullHistory);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteHistory(req: UserRequest, res: Response) {
		try {
			const historyToDelete: number[] = req.body;

			const deletedHistory = await History.destroy({
				where: {
					id: {
						[Op.in]: historyToDelete,
					},
				},
			});

			if (deletedHistory === 0) {
				return res
					.status(404)
					.json("Aucune suppression d'historique n'a été effectuée");
			}

			res.status(200).json(historyToDelete);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default historyController;
