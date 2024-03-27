import { DataTypes } from 'sequelize';
import sequelize from '../sequelize-client';

const History = sequelize.define(
	'History',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		type: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: 'history',
	}
);

export default History;
