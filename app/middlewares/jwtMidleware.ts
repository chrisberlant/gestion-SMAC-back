import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface UserRequest extends Request {
	user?: string | JwtPayload;
}

const jwtMiddleware = (req: UserRequest, res: Response, next: NextFunction) => {
	const token = req.cookies.smac_token;

	if (!token)
		// Check for the cookie presence
		return res.status(401).json('Aucun token trouvé');

	try {
		// Verify if token is valid
		const verifiedToken = jwt.verify(token, process.env.SECRET_KEY!);
		req.user = verifiedToken;
		next();
	} catch (error) {
		return res.clearCookie('smac_token').status(403).json('Token invalide');
	}
};

export default jwtMiddleware;
