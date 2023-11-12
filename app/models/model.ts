import { Model as SequelizeModel, DataTypes } from 'sequelize';
import sequelize from '../sequelize-client.ts';

interface ModelType extends SequelizeModel {
	id?: number;
	brand: string;
	reference: string;
	storage?: string;
}

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
