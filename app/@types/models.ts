import {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	Model as SequelizeModel,
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
	vip: boolean;
	serviceId?: number;
}

export interface DeviceType
	extends SequelizeModel<
		InferAttributes<DeviceType>,
		InferCreationAttributes<DeviceType>
	> {
	id: CreationOptional<number>;
	imei: string;
	preparationDate?: Date | null;
	attributionDate?: Date | null;
	status:
		| 'En stock'
		| 'Attribué'
		| 'Restitué'
		| 'En attente de restitution'
		| 'En prêt'
		| 'En panne'
		| 'Volé';
	isNew: boolean;
	comments?: string | null;
	agentId?: number | null;
	modelId?: number;
}

export interface LineType
	extends SequelizeModel<
		InferAttributes<LineType>,
		InferCreationAttributes<LineType>
	> {
	id: CreationOptional<number>;
	number: string;
	profile: string;
	status: 'Active' | 'En cours' | 'Résiliée';
	comments?: string | null;
	agentId?: number | null;
	deviceId?: number | null;
}

export interface ModelType
	extends SequelizeModel<
		InferAttributes<ModelType>,
		InferCreationAttributes<ModelType>
	> {
	id: CreationOptional<number>;
	brand: string;
	reference: string;
	storage?: string | null;
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
	role: 'Admin' | 'Tech' | 'Consultant';
}
