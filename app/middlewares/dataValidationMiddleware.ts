import { NextFunction, Response } from 'express';
import { ZodSchema } from 'zod';
import { UserRequest } from '../@types';

const dataValidation =
	(schema: ZodSchema) =>
	(req: UserRequest, res: Response, next: NextFunction) => {
		if (Object.keys(req.body).length === 0)
			// If no data were provided by the user
			return res.status(400).json('Aucune information fournie');

		for (const key in req.body) {
			if (typeof req.body[key] === 'string') {
				req.body[key] = req.body[key].trim();
				// Convert to null any empty string after trimming
				if (req.body[key] === '') req.body[key] = null;
				if (key === 'email' && req.body[key] !== null)
					req.body[key] = req.body[key].toLowerCase();
			}
		}

		// Use a schema to validate the data sent by user
		const result = schema.safeParse(req.body);
		if (!result.success)
			return res.status(400).json(result.error.issues[0].message);

		next();
	};

export default dataValidation;
