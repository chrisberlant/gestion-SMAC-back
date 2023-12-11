import { z } from 'zod';

export const getByIdSchema = z.strictObject({
	id: z
		.string({
			required_error: "L'id doit être renseigné",
		})
		.refine((id) => !isNaN(Number(id)), {
			message: "L'id doit être un nombre",
		}),
});

export const updateByIdSchema = z.strictObject({
	id: z
		.number({
			required_error: "L'id doit être renseigné",
			invalid_type_error: "L'id doit être un nombre",
		})
		.int("L'id doit être un nombre entier")
		.positive("L'id fourni est incorrect"),
});
