import { z } from 'zod';
import selectionSchema from '.';

export const userLoginSchema = z.strictObject({
	email: z
		.string({
			required_error: "L'adresse mail doit être renseignée",
		})
		.min(1, "L'adresse mail doit être renseignée")
		.email("Le format de l'adresse mail est incorrect"),
	password: z
		.string({
			required_error: 'Le mot de passe doit être renseigné',
			invalid_type_error:
				'Le mot de passe doit être une chaîne de caractères',
		})
		.min(8, 'Le mot de passe doit faire minimum 8 caractères'),
});

export const currentUserModificationSchema = z.strictObject({
	email: z
		.string()
		.min(1, "L'adresse mail ne peut pas être vide")
		.email("Le format de l'adresse mail est incorrect")
		.optional(),
	lastName: z
		.string({
			invalid_type_error:
				'Le nom de famille doit être une chaîne de caractères',
		})
		.min(1, 'Le nom de famille ne peut pas être vide')
		.optional(),
	firstName: z
		.string({
			invalid_type_error: 'Le prénom doit être une chaîne de caractères',
		})
		.min(1, 'Le prénom ne peut pas être vide')
		.optional(),
});

export const passwordModificationSchema = z.strictObject({
	oldPassword: z
		.string({ required_error: "L'ancien mot de passe doit être renseigné" })
		.min(8, "L'ancien mot de passe doit faire minimum 8 caractères"),
	newPassword: z
		.string({
			required_error: 'Le nouveau mot de passe doit être renseigné',
		})
		.min(8, 'Le nouveau mot de passe doit faire minimum 8 caractères'),
});

export const newUserCreationSchema = z.strictObject({
	email: z
		.string({ required_error: "L'adresse mail doit être renseignée" })
		.min(1, "L'adresse mail doit être renseignée")
		.email("Le format de l'adresse mail est incorrect"),
	password: z
		.string({
			required_error: 'Le mot de passe doit être renseigné',
			invalid_type_error:
				'Le mot de passe doit être une chaîne de caractères',
		})
		.min(8, 'Le mot de passe doit faire minimum 8 caractères'),
	lastName: z.string({
		required_error: 'Le nom de famille doit être renseigné',
		invalid_type_error:
			'Le nom de famille doit être une chaîne de caractères',
	}),
	firstName: z.string({
		required_error: 'Le prénom doit être renseigné',
		invalid_type_error: 'Le prénom doit être une chaîne de caractères',
	}),
	isAdmin: z.boolean({
		required_error: 'La valeur isAdmin doit être renseignée',
		invalid_type_error:
			'La valeur isAdmin doit être un booléen true ou false',
	}),
});

export const userModificationSchema = selectionSchema.extend({
	email: z
		.string()
		.min(1, "L'adresse mail ne peut pas être vide")
		.email("Le format de l'adresse mail est incorrect")
		.optional(),
	lastName: z
		.string({
			invalid_type_error: 'Le prénom doit être une chaîne de caractères',
		})
		.min(1, 'Le nom de famille ne peut pas être vide')
		.optional(),
	firstName: z
		.string({
			invalid_type_error: 'Le prénom doit être une chaîne de caractères',
		})
		.min(1, 'Le prénom ne peut pas être vide')
		.optional(),
	isAdmin: z
		.boolean({
			invalid_type_error:
				'La valeur isAdmin doit être un booléen true ou false',
		})
		.optional(),
});
