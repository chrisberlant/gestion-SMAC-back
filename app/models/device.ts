import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize-client.ts';

interface DeviceType extends Model {
	id?: number;
	IMEI: string;
	preparationDate?: Date;
	attributiontionDate?: Date;
	status: string;
	condition: string;
	comments?: string;
}

const Device = sequelize.define<DeviceType>(
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
		},
	},
	{
		tableName: 'device',
	}
);

export default Device;
