import { Response } from 'express';
import { UserRequest } from '../@types';
import { Agent } from '../models';
import { AgentWithServiceAndDevicesType } from '../@types/models';
import generateCsvFile from '../utils/csvGeneration';
import { Op } from 'sequelize';
import sequelize from 'sequelize';

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

			const existingAgent = await Agent.findOne({
				where: {
					email: {
						[Op.iLike]: infos.email,
					},
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

			const existingAgent = await Agent.findOne({
				where: {
					email: {
						[Op.iLike]: newInfos.email,
					},
					id: {
						[Op.not]: id,
					},
				},
			});
			if (existingAgent)
				return res
					.status(401)
					.json('Un agent avec cette adresse mail existe déjà');

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

	async generateAgentsCsvFile(_: UserRequest, res: Response) {
		try {
			const agents = (await Agent.findAll({
				include: [
					{
						association: 'service',
						attributes: ['title'],
					},
					{
						association: 'devices',
						attributes: ['id'],
					},
				],
			})) as AgentWithServiceAndDevicesType[];

			// Formater les données pour que le fichier soit lisible
			const formattedAgents = agents.map((agent) => {
				return {
					Email: agent.email,
					Nom: agent.lastName,
					Prenom: agent.firstName,
					VIP: agent.vip ? 'Oui' : 'Non',
					Service: agent.service.title,
					Appareils: agent.devices?.length,
				};
			});

			// Création du fichier CSV
			const csv = await generateCsvFile({
				data: formattedAgents,
				fileName: 'Agents_export',
				res,
			});

			res.status(200).send(csv);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default agentController;
