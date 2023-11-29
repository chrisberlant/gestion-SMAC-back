import { ServiceType } from '../@types/models';
import { UserRequest } from '../middlewares/jwtMidleware';
import { Service } from '../models';
import { Response } from 'express';

const serviceController = {
	async getAllServices(req: UserRequest, res: Response) {
		try {
			const services: ServiceType[] = await Service.findAll({
				order: [['title', 'ASC']],
			});

			res.status(200).json(services);
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	},
};

export default serviceController;
