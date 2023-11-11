import xss from 'xss';
import { Request, Response, NextFunction } from 'express';

// This middleware allows us to validate every data sent by the user
// We also sanitize the data here before sending it to the database
export const dataValidation =
	(schema) => (req: Request, res: Response, next: NextFunction) => {
		// We check here if user request is GET or any other type to either validate the req.params or the req.body
		const objectToValidate = req.method === 'GET' ? req.params : req.body;

		const { error, value } = schema.validate(objectToValidate);

		// Joi returns an object with attribute "error" if the data didn't pass the validation schema
		if (error) return res.status(400).json(error.details[0].message);

		for (const key in objectToValidate) {
			// Each value besides the password will be sanitized from malicious inserts
			if (key !== 'password')
				objectToValidate[key] = xss(objectToValidate[key]);
		}

		req.body = value; // Get the value returned by the validation using a schema
		next();
	};

export default dataValidation;
