import { DataTypes } from 'sequelize';
import sequelize from '../sequelize-client';
import { DeviceType } from '../types/models';

const Device = sequelize.define<DeviceType>(
	'Device',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		imei: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true,
		},
		preparationDate: {
			type: DataTypes.DATEONLY,
		},
		attributionDate: {
			type: DataTypes.DATEONLY,
		},
		status: {
			type: DataTypes.ENUM(
				'En stock',
				'Attribué',
				'Restitué',
				'En attente de restitution',
				'En prêt',
				'En panne',
				'Volé'
			),
			allowNull: false,
		},
		isNew: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		comments: {
			type: DataTypes.TEXT,
		},
	},
	{
		tableName: 'device',
	}
);

export default Device;
