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
			if (req.params.id) {
				// The id is converted to a number to be checked in the validation schema
				const convertedId = Number(req.params.id);
				const result = schema.safeParse({ id: convertedId });
				if (!result.success)
					return res.status(400).json(result.error.issues[0].message);
			} else {
				const result = schema.safeParse(req.params);
				if (!result.success)
					return res.status(400).json(result.error.issues[0].message);
			}
		} else {
			// Methods different from GET, so it must contain a body
			if (Object.keys(req.body).length === 0)
				// If no data were provided by the user
				return res.status(400).json('Aucune information fournie');

			const result = schema.safeParse(req.body);
			if (!result.success)
				return res.status(400).json(result.error.issues[0].message);

			for (const key in req.body) {
				// Each value besides the password and booleans will be sanitized from malicious inserts
				if (key !== 'password' && typeof req.body[key] !== 'boolean')
					req.body[key] = xss(req.body[key]);
			}
		}
		next();
	};

export default dataValidation;
