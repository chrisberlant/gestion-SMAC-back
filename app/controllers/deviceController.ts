import { Response } from 'express';
import { UserRequest } from '../middlewares/jwtMidleware';
import { Device } from '../models';

const deviceController = {
	async getAllDevices(_: UserRequest, res: Response) {
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
			res.status(500).json('Erreur serveur');
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
				res.status(404).json("L'appareil n'existe pas");
			}

			res.status(200).json(device);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async createDevice(req: UserRequest, res: Response) {
		try {
			const { imei } = req.body;

			const existingDevice = await Device.findOne({
				where: {
					imei,
				},
			});
			if (existingDevice)
				return res.status(401).json("L'appareil existe déjà");

			const newDevice = await Device.create(req.body);

			if (!newDevice) throw new Error("Impossible de créer l'appareil");

			res.status(201).json(newDevice);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async updateDevice(req: UserRequest, res: Response) {
		try {
			const { id, ...newInfos } = req.body;

			const device = await Device.findByPk(id);
			if (!device) return res.status(404).json("L'appareil n'existe pas");

			const deviceIsModified = await device.update(newInfos);

			res.status(200).json(deviceIsModified);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},

	async deleteDevice(req: UserRequest, res: Response) {
		try {
			const { id } = req.body;

			const device = await Device.findByPk(id);
			if (!device) return res.status(404).json("L'appareil n'existe pas");

			await device.destroy();

			res.status(200).json(id);
		} catch (error) {
			console.error(error);
			res.status(500).json('Erreur serveur');
		}
	},
};

export default deviceController;
