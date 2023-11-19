import { DataTypes } from 'sequelize';
import sequelize from '../sequelize-client.ts';
import { DeviceType } from '../@types/models.ts';

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
			field: 'IMEI',
		},
		preparationDate: {
			type: DataTypes.DATEONLY,
		},
		attributionDate: {
			type: DataTypes.DATEONLY,
		},
		status: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		condition: {
			type: DataTypes.TEXT,
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
