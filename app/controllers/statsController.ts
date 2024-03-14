import { UserRequest } from '../@types';
import { Response } from 'express';
import { Service, Model } from '../models';
import sequelize from '../sequelize-client';

const statsController = {
	async getAgentsAndDevicesPerService(_: UserRequest, res: Response) {
		try {
			//TODO fix nombre d'agents
			const agentsAndDevicesPerService = await Service.findAll({
				include: [
					{
						association: 'agents',
						attributes: [],
						include: [
							{
								association: 'devices',
								attributes: [],
							},
						],
					},
				],
				attributes: [
					[sequelize.col('title'), 'service'],
					[
						sequelize.fn('COUNT', sequelize.col('agents.id')),
						'agentsAmount',
					],
					[
						sequelize.fn(
							'COUNT',
							sequelize.col('agents.devices.id')
						),
						'devicesAmount',
					],
				],
				group: ['Service.id'],
			});

			res.status(200).json(agentsAndDevicesPerService);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async getDevicesAmountPerModel(req: UserRequest, res: Response) {
		try {
			const devicesAmountPerModel = await Model.findAll({
				include: [
					{
						association: 'devices',
						attributes: [],
					},
				],
				attributes: {
					exclude: ['id'],
					include: [
						[
							sequelize.fn('COUNT', sequelize.col('devices.id')),
							'devicesAmount',
						],
					],
				},
				order: [
					['brand', 'ASC'],
					['reference', 'ASC'],
				],
				group: ['Model.id'],
			});

			res.status(200).json(devicesAmountPerModel);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default statsController;
