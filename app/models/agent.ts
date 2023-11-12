import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize-client.ts';

interface AgentType extends Model {
	id?: number;
	email: string;
	firstName: string;
	lastName: string;
}

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
