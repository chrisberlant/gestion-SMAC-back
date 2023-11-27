import { Device } from '../models';
import { Response } from 'express';
import { UserRequest } from '../middlewares/jwtMidleware';

const deviceController = {
	async getAllDevices(req: UserRequest, res: Response) {
		try {
			const devices = await Device.findAll({
				include: [
					{
						association: 'model',
					},
					{
						association: 'agent',
						include: [{ association: 'service' }],
					},
				],
			});
			if (!devices) {
				res.status(404).json('Aucune ligne trouvée');
			}

			res.status(200).json(devices);
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	},

	async getDeviceById(req: UserRequest, res: Response) {
		try {
			const { id } = req.params;

			const device = await Device.findByPk(id, {
				include: [
					{
						association: 'model',
					},
					{
						association: 'agent',
						include: [{ association: 'service' }],
					},
				],
			});
			if (!device) {
				res.status(404).json('Aucun appareil trouvé');
			}

			res.status(200).json(device);
		} catch (error) {
			console.error(error);
			res.status(500).json(error);
		}
	},
};

export default deviceController;
