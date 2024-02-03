import { z } from 'zod';

export const userLoginSchema = z.strictObject({
	email: z
		.string({
			required_error: "L'adresse mail doit être renseignée",
			invalid_type_error: "Le format de l'adresse mail est incorrect",
		})
		.email("Le format de l'adresse mail est incorrect"),
	password: z
		.string({
			required_error: 'Le mot de passe doit être renseigné',
			invalid_type_error:
				'Le mot de passe doit être une chaîne de caractères',
		})
		.min(8, 'Le mot de passe doit faire minimum 8 caractères')
		.regex(
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*()-])/,
			'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial'
		),
});

export const currentUserUpdateSchema = z
	.strictObject({
		email: z
			.string({
				invalid_type_error: "Le format de l'adresse mail est incorrect",
			})
			.email("Le format de l'adresse mail est incorrect"),
		lastName: z
			.string({
				invalid_type_error:
					'Le nom de famille doit être une chaîne de caractères',
			})
			.optional(),
		firstName: z.string({
			invalid_type_error: 'Le prénom doit être une chaîne de caractères',
		}),
	})
	.partial();

export const currentUserPasswordUpdateSchema = z
	.strictObject({
		oldPassword: z
			.string({
				required_error: "L'ancien mot de passe doit être renseigné",
				invalid_type_error:
					"Le format de l'ancien mot de passe est incorrect",
			})
			.min(8, "L'ancien mot de passe doit faire minimum 8 caractères")
			.regex(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*()-])/,
				"L'ancien de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial"
			),
		newPassword: z
			.string({
				required_error: 'Le nouveau mot de passe doit être renseigné',
				invalid_type_error:
					'Le format du nouveau mot de passe est incorrect',
			})
			.min(8, 'Le nouveau mot de passe doit faire minimum 8 caractères')
			.regex(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*()-])/,
				'Le nouveau mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial'
			),
		confirmPassword: z
			.string({
				required_error:
					'La confirmation du nouveau mot de passe doit être renseignée',
				invalid_type_error:
					'Le format de la confirmation du nouveau mot de passe est incorrect',
			})
			.min(
				8,
				'La confirmation du nouveau mot de passe doit faire minimum 8 caractères'
			),
	})
	.refine(
		(data) => data.oldPassword !== data.newPassword,
		"L'ancien mot de passe et le nouveau sont identiques"
	)
	.refine(
		(data) => data.newPassword === data.confirmPassword,
		'Le nouveau mot de passe et sa confirmation sont différents'
	);

export const userCreationSchema = z.strictObject({
	email: z
		.string({
			required_error: "L'adresse mail doit être renseignée",
			invalid_type_error: "Le format de l'adresse mail est incorrect",
		})
		.email("Le format de l'adresse mail est incorrect"),
	lastName: z.string({
		required_error: 'Le nom de famille doit être renseigné',
		invalid_type_error:
			'Le nom de famille doit être une chaîne de caractères',
	}),
	firstName: z.string({
		required_error: 'Le prénom doit être renseigné',
		invalid_type_error: 'Le prénom doit être une chaîne de caractères',
	}),
	role: z.enum(['Admin', 'Tech', 'Consultant'], {
		errorMap: () => {
			return {
				message: 'Le rôle doit être Admin, Tech ou Consultant',
			};
		},
	}),
});

export const userUpdateSchema = z.strictObject({
	id: z
		.number({
			required_error: "L'id doit être renseigné",
			invalid_type_error: "L'id doit être un nombre",
		})
		.int("L'id doit être un nombre entier")
		.positive("L'id fourni est incorrect")
		.refine(
			(data) => data !== 1,
			"Vous n'avez pas les droits pour modifier cet utilisateur"
		),
	email: z
		.string({
			invalid_type_error: "Le format de l'adresse mail est incorrect",
		})
		.email("Le format de l'adresse mail est incorrect")
		.optional(),
	lastName: z
		.string({
			invalid_type_error:
				'Le nom de famille doit être une chaîne de caractères',
		})
		.optional(),
	firstName: z
		.string({
			invalid_type_error: 'Le prénom doit être une chaîne de caractères',
		})
		.optional(),
	role: z
		.enum(['Admin', 'Tech', 'Consultant'], {
			errorMap: () => {
				return {
					message: 'Le rôle doit être Admin, Tech ou Consultant',
				};
			},
		})
		.optional(),
});
