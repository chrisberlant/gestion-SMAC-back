import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize-client.ts';

interface ServiceType extends Model {
	id?: number;
	title: string;
}

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
