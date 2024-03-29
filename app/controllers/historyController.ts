import { Response } from 'express';
import { UserRequest } from '../@types';
import { History } from '../models';

const historyController = {
	async getAllHistory(_: UserRequest, res: Response) {
		try {
			const fullHistory = await History.findAll({
				order: [['id', 'DESC']],
				include: [
					{
						association: 'user',
						attributes: ['id', 'email'],
					},
				],
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
			const { id } = req.params;

			const history = await History.findByPk(id);
			if (!history)
				return res
					.status(404)
					.json("L'historique sélectionné n'existe pas");

			await history.destroy();

			res.status(200).json(id);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default historyController;
