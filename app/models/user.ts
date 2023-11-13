import { Model, DataTypes } from 'sequelize';
import sequelize from '../sequelize-client.ts';

interface UserType extends Model {
	id?: number;
	email: string;
	firstName: string;
	lastName: string;
	password?: string;
	isAdmin?: boolean;
}

const User = sequelize.define<UserType>(
	'User',
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
		password: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		isAdmin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		tableName: 'user',
	}
);

export default User;
