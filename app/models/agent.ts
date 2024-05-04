import { DataTypes } from 'sequelize';
import { AgentType } from '../types/models';
import sequelize from '../sequelize-client';

const Agent = sequelize.define<AgentType>(
	'Agent',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		email: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true,
		},
		firstName: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		vip: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		tableName: 'agent',
	}
);

export default Agent;
