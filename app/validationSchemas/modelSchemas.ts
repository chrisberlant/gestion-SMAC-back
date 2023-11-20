import { z } from 'zod';
import selectionSchema from '.';

export const modelCreationSchema = z.object({
	brand: z.string({
		required_error: 'La marque doit être renseignée',
		invalid_type_error: 'La marque doit être une chaîne de caractères',
	}),
	reference: z.string({
		required_error: 'La référence doit être renseignée',
		invalid_type_error: 'La référence doit être une chaîne de caractères',
	}),
	storage: z
		.string({
			invalid_type_error:
				'Le stockage doit être une chaîne de caractères',
		})
		.optional(),
});

export const modelModificationSchema = selectionSchema.extend({
	brand: z
		.string({
			invalid_type_error: 'La marque doit être une chaîne de caractères',
		})
		.optional(),
	reference: z
		.string({
			invalid_type_error:
				'La référence doit être une chaîne de caractères',
		})
		.optional(),
	storage: z
		.string({
			invalid_type_error:
				'Le stockage doit être une chaîne de caractères',
		})
		.optional(),
});
