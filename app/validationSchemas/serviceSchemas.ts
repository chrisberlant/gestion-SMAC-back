import { z } from 'zod';
import selectionSchema from '.';

export const serviceCreationSchema = z.strictObject({
	title: z
		.string({
			required_error: 'Le titre doit être renseigné',
			invalid_type_error: 'Le titre doit être une chaîne de caractères',
		})
		.trim()
		.min(1, 'Le titre doit être renseigné'),
});

export const serviceUpdateSchema = selectionSchema.extend({
	title: z
		.string({
			required_error: 'Le titre doit être renseigné',
			invalid_type_error: 'Le titre doit être une chaîne de caractères',
		})
		.trim()
		.min(1, 'Le titre doit être renseigné'),
});
