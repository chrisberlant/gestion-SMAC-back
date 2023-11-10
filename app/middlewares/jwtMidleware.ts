import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwtMiddleware = (req, res, next) => {
	const token = req.cookies.jobmemo_token;
	const secretKey: Secret = process.env.SECRET_KEY!;

	if (!token)
		// Check for the cookie presence
		return res.status(401).json('Aucun token trouvé');

	try {
		// Verify if token is valid
		const verifiedToken = jwt.verify(token, secretKey);
		req.user = verifiedToken;
		next();
	} catch (error) {
		return res.status(403).json('Token invalide');
	}
};

export default jwtMiddleware;
