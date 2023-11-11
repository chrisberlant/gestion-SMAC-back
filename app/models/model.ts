import { DataTypes } from 'sequelize';
import sequelize from '../sequelize-client.ts';

const Model = sequelize.define(
	'Model',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		brand: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		reference: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		storage: {
			type: DataTypes.TEXT,
		},
	},
	{
		tableName: 'model',
	}
);

export default Model;
