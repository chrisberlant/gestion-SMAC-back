import { DataTypes } from 'sequelize';
import sequelize from '../sequelize-client';
import { ModelType } from '../types/models';

const Model = sequelize.define<ModelType>(
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
