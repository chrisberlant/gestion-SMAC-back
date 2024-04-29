import { Response } from 'express';
import { UserRequest } from '../@types';
import { Agent, History, Service } from '../models';
import {
	AgentType,
	AgentWithServiceAndDevicesType,
	AgentsImportType,
} from '../@types/models';
import generateCsvFile from '../utils/csvGeneration';
import { Op } from 'sequelize';
import sequelize from '../sequelize-client';
import { receivedDataIsAlreadyExisting } from '../utils';

const agentController = {
	async getAllAgents(_: UserRequest, res: Response) {
		try {
			const agents = await Agent.findAll({
				order: [['id', 'DESC']],
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
			const clientData: AgentType = req.body;
			const { email } = clientData;
			const userId = req.user!.id;

			const existingAgent = await Agent.findOne({
				where: {
					email,
				},
			});
			if (existingAgent)
				return res.status(409).json("L'agent existe déjà");

			// Transaction de création
			const transaction = await sequelize.transaction();
			try {
				const newAgent = await Agent.create(clientData, {
					transaction,
				});
				await History.create(
					{
						operation: 'Création',
						table: 'agent',
						content: `Création de l'agent ${email}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(201).json(newAgent);
			} catch (error) {
				await transaction.rollback();
				throw new Error("Impossible de créer l'agent");
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateAgent(req: UserRequest, res: Response) {
		try {
			const clientData = req.body;
			const { id } = req.params;
			const userId = req.user!.id;

			const agent = await Agent.findByPk(id);
			if (!agent) return res.status(404).json("L'agent n'existe pas");

			// Si les valeurs sont identiques, pas de mise à jour en BDD
			if (receivedDataIsAlreadyExisting(agent, clientData))
				return res.status(200).json(agent);

			const oldEmail = agent.email;
			let content = `Mise à jour de l'agent ${oldEmail}`;

			// Si le client souhaite changer l'adresse mail, vérification si celle-ci n'est pas déjà utilisée
			if (clientData.email && clientData.email !== oldEmail) {
				const newEmail = clientData.email;

				const existingEmail = await Agent.findOne({
					where: {
						email: newEmail,
						id: {
							[Op.not]: Number(id),
						},
					},
				});
				if (existingEmail)
					return res
						.status(401)
						.json('Un agent avec cette adresse mail existe déjà');

				content = `Mise à jour de l'agent ${oldEmail}, incluant un changement d'email vers ${newEmail}`;
			}

			// Transaction de mise à jour
			const transaction = await sequelize.transaction();
			try {
				const updatedAgent = await agent.update(clientData, {
					transaction,
				});
				await History.create(
					{
						operation: 'Modification',
						table: 'agent',
						content,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(200).json(updatedAgent);
			} catch (error) {
				await transaction.rollback();
				throw new Error("Impossible de mettre à jour l'agent");
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteAgent(req: UserRequest, res: Response) {
		try {
			const { id } = req.params;
			const userId = req.user!.id;

			const agent = await Agent.findByPk(id);
			if (!agent) return res.status(404).json("L'agent n'existe pas");

			// Transaction de suppression
			const transaction = await sequelize.transaction();
			try {
				await agent.destroy({ transaction });
				await History.create(
					{
						operation: 'Suppression',
						table: 'agent',
						content: `Suppression de l'agent avec l'email ${agent.email}`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(200).json(id);
			} catch (error) {
				await transaction.rollback();
				throw new Error("Impossible de supprimer l'agent");
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async exportAgentsCsvFile(_: UserRequest, res: Response) {
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
					Prénom: agent.firstName,
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

	async generateEmptyAgentsCsvFile(_: UserRequest, res: Response) {
		try {
			// Formater les données pour que le fichier soit lisible
			const headers = {
				Email: '',
				Nom: '',
				Prénom: '',
				VIP: '',
				Service: '',
				Appareils: '',
			};

			// Création du fichier CSV
			const csv = await generateCsvFile({
				data: headers,
				fileName: 'Agents_import',
				res,
			});

			res.status(200).send(csv);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async importMultipleAgents(req: UserRequest, res: Response) {
		try {
			const userId = req.user!.id;
			// Agents importés depuis le CSV
			const importedAgents: AgentsImportType = req.body;

			const services = await Service.findAll({ raw: true });

			// Formatage des données des agents pour insertion en BDD
			const formattedImportedAgents = importedAgents.map((agent) => ({
				email: agent.Email,
				lastName: agent.Nom,
				firstName: agent.Prénom,
				vip: agent.VIP.toLowerCase() === 'oui' ? true : false,
				serviceId: services.find(
					(service) =>
						service.title.toLowerCase() ===
						agent.Service.toLowerCase()
				)?.id,
			}));

			const currentAgents = await Agent.findAll({ raw: true });
			const alreadyExistingEmails: string[] = [];

			// Vérification pour chaque agent importé qu'un agent avec son adresse mail n'est pas existant
			formattedImportedAgents.forEach((importedAgent) => {
				if (
					currentAgents.find(
						(currentAgent) =>
							currentAgent.email === importedAgent.email
					)
				)
					alreadyExistingEmails.push(importedAgent.email);
			});

			// Renvoi au client des adresses mail déjà présentes en BDD
			if (alreadyExistingEmails.length > 0)
				return res.status(409).json(alreadyExistingEmails);

			// Transaction d'import
			const transaction = await sequelize.transaction();
			try {
				await Agent.bulkCreate(formattedImportedAgents, {
					transaction,
				});
				await History.create(
					{
						operation: 'Création',
						table: 'agent',
						content: `Import d'agents via un CSV`,
						userId,
					},
					{ transaction }
				);
				await transaction.commit();

				res.status(200).json('ok');
			} catch (error) {
				await transaction.rollback();
				throw new Error("Impossible de créer l'agent");
			}
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default agentController;
