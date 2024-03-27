import { DataTypes } from 'sequelize';
import sequelize from '../sequelize-client';
import { HistoryType } from '../@types/models';

const History = sequelize.define<HistoryType>(
	'History',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		operation: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		table: {
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
