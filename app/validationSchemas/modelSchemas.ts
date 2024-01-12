import { z } from 'zod';
import selectionSchema from '.';

export const modelCreationSchema = z.strictObject({
	brand: z
		.string({
			required_error: 'La marque doit être renseignée',
			invalid_type_error: 'La marque doit être une chaîne de caractères',
		})
		.min(1, 'La marque ne peut pas être vide'),
	reference: z
		.string({
			required_error: 'Le modèle doit être renseigné',
			invalid_type_error: 'Le modèle doit être une chaîne de caractères',
		})
		.min(1, 'Le modèle ne peut pas être vide'),
	storage: z
		.string({
			invalid_type_error:
				'Le stockage doit être une chaîne de caractères',
		})
		.optional(),
});

export const modelUpdateSchema = selectionSchema
	.extend({
		brand: z.string({
			invalid_type_error: 'La marque doit être une chaîne de caractères',
		}),
		reference: z
			.string({
				invalid_type_error:
					'Le modèle doit être une chaîne de caractères',
			})
			.min(1, 'Le modèle ne peut pas être vide'),
		storage: z.string({
			invalid_type_error:
				'Le stockage doit être une chaîne de caractères',
		}),
	})
	.partial();
