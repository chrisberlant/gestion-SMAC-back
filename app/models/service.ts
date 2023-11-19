import { DataTypes } from 'sequelize';
import sequelize from '../sequelize-client.ts';
import { ServiceType } from '../@types/models.ts';

const Service = sequelize.define<ServiceType>(
	'Service',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: 'service',
	}
);

export default Service;
