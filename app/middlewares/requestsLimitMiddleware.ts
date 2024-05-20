import { rateLimit } from 'express-rate-limit';

const requestsLimitMiddleware = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	message: 'Nombre maximal de requêtes par minute atteint.',
	headers: true,
});

export default requestsLimitMiddleware;
