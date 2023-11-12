import { Model, Optional, DataTypes } from 'sequelize';
import sequelize from '../sequelize-client.ts';

interface UserAttributes {
	id?: number;
	email?: string;
	firstName?: string;
	lastName?: string;
	password?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

interface UserInstance
	extends Model<UserAttributes, UserCreationAttributes>,
		UserAttributes {}

const User = sequelize.define<UserInstance>(
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
	},
	{
		tableName: 'user',
	}
);

export default User;
