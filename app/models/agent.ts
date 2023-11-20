import { DataTypes } from 'sequelize';
import sequelize from '../sequelize-client';
import { AgentType } from '../@types/models';

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
	},
	{
		tableName: 'agent',
	}
);

export default Agent;
