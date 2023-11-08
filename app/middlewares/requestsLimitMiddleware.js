import { rateLimit } from 'express-rate-limit';

const requestsLimitMiddleware = rateLimit({
	windowMs: 60 * 1000, // In one minute
	max: 5, // Maximum number of queries allowed
	message: 'Nombre maximal de requêtes par minute atteint.',
	headers: true,
});

export default requestsLimitMiddleware;
