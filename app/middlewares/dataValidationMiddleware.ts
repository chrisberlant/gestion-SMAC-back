import { NextFunction, Response } from 'express';
import { ZodSchema } from 'zod';
import { UserRequest } from '../types';
import { convertToDate } from '../utils';

// Validation et formatage des données envoyées par le client avant envoi au contrôleur
const dataValidation =
	(schema: ZodSchema) =>
	(req: UserRequest, res: Response, next: NextFunction) => {
		const clientData = req.body;

		// Si aucune information dans le corps de la requête
		if (Object.keys(clientData).length === 0)
			return res.status(400).json('Aucune information fournie');

		// S'il s'agit d'un import d'un fichier et qu'un tableau est fourni, itération sur chaque propriété de chaque élément
		if (Array.isArray(clientData)) {
			clientData.forEach((row) => {
				Object.entries(row).forEach(([key, value]) => {
					if (typeof value === 'string') {
						row[key] = value.trim();
						// Conversion en nul de chaque string vide après le trimming
						if (row[key] === '') row[key] = null;
						// Passage en minuscule des emails pour cohérence dans la BDD
						if (
							(key === 'Propriétaire' || key === 'Email') &&
							row[key]
						)
							row[key] = row[key].toLowerCase();
						// Vérification s'il s'agit d'une string représentant une date et modification si besoin
						row[key] = convertToDate(row[key]);
					}
				});
			});
			// Sinon itération sur chaque propriété
		} else {
			Object.entries(clientData).forEach(([key, value]) => {
				if (typeof value === 'string') {
					clientData[key] = value.trim();
					// Conversion en nul de chaque string vide après le trimming
					if (clientData[key] === '') clientData[key] = null;
					// Passage en minuscule des emails pour cohérence dans la BDD
					if (key === 'email' && clientData[key])
						value = value.toLowerCase();
					// Vérification s'il s'agit d'une string représentant une date et modification si besoin
					clientData[key] = convertToDate(clientData[key]);
				}
			});
		}

		// Validation via un schéma
		const result = schema.safeParse(clientData);
		if (!result.success)
			return res.status(400).json(result.error.issues[0].message);

		next();
	};

export default dataValidation;
