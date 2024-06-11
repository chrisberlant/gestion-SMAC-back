import { DataTypes } from 'sequelize';
import sequelize from '../sequelize-client';
import { HistoryType } from '../types/models';

const History = sequelize.define<HistoryType>(
	'History',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		operation: {
			type: DataTypes.ENUM('Création', 'Modification', 'Suppression'),
			allowNull: false,
		},
		table: {
			type: DataTypes.ENUM(
				'user',
				'service',
				'agent',
				'model',
				'device',
				'line'
			),
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		updatedAt: false,
		tableName: 'history',
	}
);

export default History;
