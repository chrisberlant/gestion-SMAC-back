import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export type RoleType = 'Admin' | 'Tech';

export interface UserRequest extends Request {
	user?: JwtPayload;
}

export type TableType =
	| 'user'
	| 'service'
	| 'agent'
	| 'model'
	| 'device'
	| 'line';
