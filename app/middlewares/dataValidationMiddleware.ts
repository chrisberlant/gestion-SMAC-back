import xss from 'xss';
import { Response, NextFunction } from 'express';
import { UserRequest } from './jwtMidleware';
import { ZodSchema } from 'zod';

// This middleware allows us to validate every data sent by the user
// We also sanitize the data here before sending it to the database
const dataValidation =
	(schema: ZodSchema) =>
	(req: UserRequest, res: Response, next: NextFunction) => {
		// We check here if user request is GET or any other type to either validate the req.params or the req.body
		if (req.method === 'GET') {
			const result = schema.safeParse(req.params);
			if (!result.success)
				return res.status(400).json(result.error.issues[0].message);
			for (const key in req.params) {
				req.params[key] = xss(req.params[key]);
			}
		} else {
			console.log(req.body);
			const result = schema.safeParse(req.body);
			if (!result.success)
				return res.status(400).json(result.error.issues[0].message);
			for (const key in req.body) {
				// Each value besides the password will be sanitized from malicious inserts
				if (key !== 'password') req.body[key] = xss(req.body[key]);
			}
		}
		next();
	};

export default dataValidation;
