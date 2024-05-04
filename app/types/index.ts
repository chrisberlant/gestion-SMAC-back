import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export type RoleType = 'Admin' | 'Tech';

export interface UserRequest extends Request {
	user?: JwtPayload;
}
