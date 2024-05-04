import { DataTypes } from 'sequelize';
import sequelize from '../sequelize-client';
import { LineType } from '../types/models';

const Line = sequelize.define<LineType>(
	'Line',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		number: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		profile: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		status: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		comments: {
			type: DataTypes.TEXT,
		},
	},
	{
		tableName: 'line',
	}
);

export default Line;
