import { DataTypes } from 'sequelize';
import { UserType } from '../types/models';
import sequelize from '../sequelize-client';

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
		role: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		tableName: 'user',
	}
);

export default User;
