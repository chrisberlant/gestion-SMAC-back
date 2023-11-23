import {
	Model as SequelizeModel,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
} from 'sequelize';

export interface AgentType
	extends SequelizeModel<
		InferAttributes<AgentType>,
		InferCreationAttributes<AgentType>
	> {
	id: CreationOptional<number>;
	email: string;
	firstName: string;
	lastName: string;
}

export interface DeviceType
	extends SequelizeModel<
		InferAttributes<DeviceType>,
		InferCreationAttributes<DeviceType>
	> {
	id: CreationOptional<number>;
	imei: string;
	preparationDate?: Date;
	attributionDate?: Date;
	status: string;
	condition: string;
	comments?: string;
}

export interface LineType
	extends SequelizeModel<
		InferAttributes<LineType>,
		InferCreationAttributes<LineType>
	> {
	id: CreationOptional<number>;
	number: string;
	profile: string;
	status: string;
	comments?: string;
}

export interface ModelType
	extends SequelizeModel<
		InferAttributes<ModelType>,
		InferCreationAttributes<ModelType>
	> {
	id: CreationOptional<number>;
	brand: string;
	reference: string;
	storage?: string;
}

export interface ServiceType
	extends SequelizeModel<
		InferAttributes<ServiceType>,
		InferCreationAttributes<ServiceType>
	> {
	id: CreationOptional<number>;
	title: string;
}

export interface UserType
	extends SequelizeModel<
		InferAttributes<UserType>,
		InferCreationAttributes<UserType>
	> {
	id?: CreationOptional<number>;
	email: string;
	firstName: string;
	lastName: string;
	password?: string;
	isAdmin?: boolean;
}
