import { z } from 'zod';
import selectionSchema from './index.ts';

export const userLoginSchema = z.object({
	email: z
		.string({
			required_error: "L'adresse mail doit être renseignée",
		})
		.email({ message: "Le format de l'adresse mail est incorrect" }),
	password: z
		.string({
			required_error: 'Le mot de passe doit être renseignée',
			invalid_type_error:
				'Le mot de passe doit être une chaîne de caractères',
		})
		.min(8, { message: 'Le mot de passe doit faire minimum 8 caractères' }),
});

export const userRegistrationSchema = z.object({
	email: z
		.string({ required_error: "L'adresse mail doit être renseignée" })
		.email({ message: "Le format de l'adresse mail est incorrect" }),
	password: z
		.string({
			required_error: 'Le mot de passe doit être renseigné',
			invalid_type_error:
				'Le mot de passe doit être une chaîne de caractères',
		})
		.min(8, { message: 'Le mot de passe doit faire minimum 8 caractères' }),
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

export const userModificationSchema = z.object({
	email: z
		.string()
		.email({ message: "Le format de l'adresse mail est incorrect" })
		.optional(),
	lastName: z
		.string({
			invalid_type_error: 'Le prénom doit être une chaîne de caractères',
		})
		.optional(),
	firstName: z
		.string({
			invalid_type_error: 'Le prénom doit être une chaîne de caractères',
		})
		.optional(),
});

export const passwordModificationSchema = z.object({
	oldPassword: z
		.string({ required_error: "L'ancien mot de passe doit être renseigné" })
		.min(8, {
			message: "L'ancien mot de passe doit faire minimum 8 caractères",
		}),
	newPassword: z
		.string({
			required_error: 'Le nouveau mot de passe doit être renseigné',
		})
		.min(8, {
			message: 'Le nouveau mot de passe doit faire minimum 8 caractères',
		}),
});

export const newUserCreationSchema = z.object({
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

export const userRightsModificationSchema = selectionSchema.extend({
	isAdmin: z.boolean({
		required_error: 'La valeur isAdmin doit être renseignée',
	}),
});
