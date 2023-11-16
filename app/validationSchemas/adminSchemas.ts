import { z, ZodSchema } from 'zod';
import selectionSchema from './index.ts';

export const newUserCreationSchema: ZodSchema = z.object({
	email: z
		.string({
			required_error: "L'adresse mail doit être renseignée",
		})
		.email({ message: "Le format de l'adresse mail est incorrect" }),
	lastName: z.string({
		required_error: 'Le nom de famille doit être renseigné',
		invalid_type_error:
			'Le nom de famille doit être une chaîne de caractères',
	}),
	firstName: z.string({
		required_error: 'Le prénom doit être renseigné',
		invalid_type_error: 'Le prénom doit être une chaîne de caractères',
	}),
});

export const userRightsModificationSchema: ZodSchema = selectionSchema.extend({
	id: z
		.number({
			required_error: "L'id doit être renseigné",
			invalid_type_error: "L'id doit être un nombre entier",
		})
		.int()
		.min(1, { message: "L'id fourni est incorrect" }),
	isAdmin: z.boolean({
		required_error: 'La valeur isAdmin doit être renseignée',
	}),
});

export const modelCreationSchema: ZodSchema = z.object({
	brand: z.string({
		required_error: 'La marque doit être renseignée',
	}),
	reference: z.string({
		required_error: 'La référénce doit être renseignée',
	}),
	storage: z.string({
		required_error: 'Le stockage doit être renseigné',
	}),
});

export const modelModificationSchema: ZodSchema = z.object({
	id: z
		.number({
			required_error: "L'id doit être renseigné",
			invalid_type_error: "L'id doit être un nombre entier",
		})
		.int()
		.min(1, { message: "L'id fourni est incorrect" }),
	brand: z.string().optional(),
	reference: z.string().optional(),
	storage: z.string().optional(),
});
