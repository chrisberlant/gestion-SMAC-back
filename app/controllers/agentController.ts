import { Response } from 'express';
import { UserRequest } from '../middlewares/jwtMidleware';
import { Agent } from '../models';

const agentController = {
	async getAllAgents(_: UserRequest, res: Response) {
		try {
			const agents = await Agent.findAll({
				order: [['id', 'DESC']],
				include: [
					{
						association: 'devices',
						attributes: ['id'],
					},
				],
			});
			if (!agents) {
				res.status(404).json('Aucun agent trouvé');
			}

			res.status(200).json(agents);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async getAgentById(req: UserRequest, res: Response) {
		try {
			const { id } = req.params;

			const agent = await Agent.findByPk(id, {
				include: [
					{
						association: 'service',
					},
				],
			});
			if (!agent) {
				res.status(404).json('Aucun agent trouvé');
			}

			res.status(200).json(agent);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async createAgent(req: UserRequest, res: Response) {
		try {
			const infos = req.body;
			const { email } = infos;

			const existingAgent = await Agent.findOne({
				where: {
					email,
				},
			});
			if (existingAgent)
				return res.status(401).json("L'agent existe déjà");

			const newAgent = await Agent.create(infos);

			if (!newAgent) throw new Error("Impossible de créer l'agent");

			res.status(201).json(newAgent);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateAgent(req: UserRequest, res: Response) {
		try {
			const { id, ...newInfos } = req.body;

			const agent = await Agent.findByPk(id);
			if (!agent) return res.status(404).json("L'agent n'existe pas");

			const agentIsModified = await agent.update(newInfos);

			res.status(200).json(agentIsModified);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteAgent(req: UserRequest, res: Response) {
		try {
			const { id } = req.body;

			const agent = await Agent.findByPk(id);
			if (!agent) return res.status(404).json("L'agent n'existe pas");

			await agent.destroy();

			res.status(200).json(id);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default agentController;
