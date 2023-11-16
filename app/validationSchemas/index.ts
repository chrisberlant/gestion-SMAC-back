import { z, ZodSchema } from 'zod';

const selectionSchema: ZodSchema = z.object({
	id: z
		.number({
			required_error: "L'id doit être renseigné",
			invalid_type_error: "L'id doit être un nombre entier",
		})
		.int()
		.min(1, { message: "L'id fourni est incorrect" }),
});

export default selectionSchema;
