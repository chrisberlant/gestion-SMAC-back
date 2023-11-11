import { DataTypes } from 'sequelize';
import sequelize from '../sequelize-client.ts';

const Device = sequelize.define(
	'Device',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		IMEI: {
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
			type: DataTypes.TEXT,
			allowNull: false,
		},
		condition: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		comments: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: 'device',
	}
);

export default Device;
