import { z } from 'zod';

export const serviceCreationSchema = z.strictObject({
	title: z.string({
		required_error: 'Le titre doit être renseigné',
		invalid_type_error: 'Le titre doit être une chaîne de caractères',
	}),
});

export const serviceUpdateSchema = z.strictObject({
	title: z.string({
		required_error: 'Le titre doit être renseigné',
		invalid_type_error: 'Le titre doit être une chaîne de caractères',
	}),
});
