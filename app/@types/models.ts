import { Model as SequelizeModel } from 'sequelize';

export interface AgentType extends SequelizeModel {
	id?: number;
	email: string;
	firstName: string;
	lastName: string;
}

export interface DeviceType extends SequelizeModel {
	id?: number;
	imei: string;
	preparationDate?: Date;
	attributiontionDate?: Date;
	status: string;
	condition: string;
	comments?: string;
}

export interface LineType extends SequelizeModel {
	id?: number;
	number: string;
	profile: string;
	status: string;
	comments?: string;
}

export interface ModelType extends SequelizeModel {
	id?: number;
	brand: string;
	reference: string;
	storage?: string;
}

export interface ServiceType extends SequelizeModel {
	id?: number;
	title: string;
}

export interface UserType extends SequelizeModel {
	id?: number;
	email: string;
	firstName: string;
	lastName: string;
	password?: string;
	isAdmin?: boolean;
}
