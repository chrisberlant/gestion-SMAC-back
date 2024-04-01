import {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	Model as SequelizeModel,
} from 'sequelize';
import { agentsImportSchema } from '../validationSchemas/agentSchemas';
import { devicesImportSchema } from '../validationSchemas/deviceSchemas';
import z from 'zod';
import { linesImportSchema } from '../validationSchemas/lineSchemas';

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
	id: CreationOptional<number>;
	email: string;
	firstName: string;
	lastName: string;
	password?: string;
	role: 'Admin' | 'Tech' | 'Consultant';
}

export interface HistoryType
	extends SequelizeModel<
		InferAttributes<HistoryType>,
		InferCreationAttributes<HistoryType>
	> {
	id: CreationOptional<number>;
	operation: 'Create' | 'Update' | 'Delete';
	table: 'user' | 'service' | 'agent' | 'model' | 'device' | 'line';
	content: string;
	userId?: number;
}

// Interfaces utilisées pour les exports en CSV
export interface AgentWithServiceAndDevicesType extends AgentType {
	service: {
		title: string;
	};
	devices: {
		id: number;
	}[];
}

export interface DeviceWithModelAndAgentType extends DeviceType {
	model: Omit<ModelType, 'id'>;
	agent: {
		email: string;
		service: {
			title: string;
		};
	};
}

export interface LineWithAgentAndDeviceType extends LineType {
	agent: {
		email: string;
		service: {
			title: string;
		};
	};
	device: {
		imei: string;
		model: Omit<ModelType, 'id'>;
	};
}

// Interfaces utilisées pour les imports en CSV
export type AgentsImportType = z.infer<typeof agentsImportSchema>;
export type DevicesImportType = z.infer<typeof devicesImportSchema>;
export type LinesImportType = z.infer<typeof linesImportSchema>;
