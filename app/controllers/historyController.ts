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
			const clientData: number[] = req.body;

			const history = await History.findAll({
				where: {
					id: {
						[Op.in]: clientData,
					},
				},
			});
			if (!history)
				return res
					.status(404)
					.json(
						"Les entrées d'historique sélectionnées n'existent pas"
					);

			await Promise.all(
				history.map(async (entry) => {
					// Supprimer chaque entrée trouvée
					await entry.destroy();
				})
			);

			res.status(200).json(history);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default historyController;
