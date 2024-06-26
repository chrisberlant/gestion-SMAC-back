import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { UserRequest } from '../types';

const jwtMiddleware = (req: UserRequest, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token)
		// Check for the JWT presence
		return res.status(401).json('Aucun token trouvé');

	try {
		// Verify if token is valid
		const verifiedToken = jwt.verify(
			token,
			process.env.SECRET_KEY!
		) as JwtPayload;
		req.user = verifiedToken;
		next();
	} catch (error) {
		return res.status(403).json('Token invalide');
	}
};

export default jwtMiddleware;
