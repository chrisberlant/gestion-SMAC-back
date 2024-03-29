import { z } from 'zod';

export const lineCreationSchema = z.strictObject({
	number: z
		.string({
			required_error: 'Le numéro doit être renseigné',
			invalid_type_error: 'Le numéro doit être une chaîne de caractères',
		})
		.length(10, 'Le numéro doit faire 10 caractères'),
	profile: z.enum(['V', 'D', 'VD'], {
		errorMap: () => {
			return {
				message: 'Le profil doit être V, D ou VD',
			};
		},
	}),
	status: z.enum(['Active', 'En cours', 'Résiliée'], {
		errorMap: () => {
			return {
				message: 'Le statut doit être Attribuée, En cours ou Résiliée',
			};
		},
	}),
	comments: z
		.string({
			invalid_type_error:
				'Les commentaires doivent être une chaîne de caractères',
		})
		.nullable()
		.optional(),
	agentId: z
		.number({
			invalid_type_error: "L'id doit être un nombre",
		})
		.int("L'id de l'agent doit être un nombre entier")
		.positive("L'id de l'agent fourni est incorrect")
		.nullable()
		.optional(),
	deviceId: z
		.number({
			invalid_type_error: "L'id doit être un nombre",
		})
		.int("L'id de l'appareil doit être un nombre entier")
		.positive("L'id de l'appareil fourni est incorrect")
		.nullable()
		.optional(),
});

export const lineUpdateSchema = z.strictObject({
	number: z
		.string({
			required_error: 'Le numéro doit être renseigné',
			invalid_type_error: 'Le numéro doit être une chaîne de caractères',
		})
		.trim()
		.length(10, 'Le numéro doit faire 10 caractères')
		.optional(),
	profile: z
		.enum(['V', 'D', 'VD'], {
			errorMap: () => {
				return {
					message: 'Le profil doit être V, D ou VD',
				};
			},
		})
		.optional(),
	status: z
		.enum(['Active', 'En cours', 'Résiliée'], {
			errorMap: () => {
				return {
					message:
						'Le statut doit être Attribuée, En cours ou Résiliée',
				};
			},
		})
		.optional(),
	comments: z
		.string({
			invalid_type_error:
				'Le stockage doit être une chaîne de caractères',
		})
		.nullable()
		.optional(),
	agentId: z
		.number({
			invalid_type_error: "L'id doit être un nombre",
		})
		.int("L'id de l'agent doit être un nombre entier")
		.positive("L'id de l'agent fourni est incorrect")
		.nullable()
		.optional(),
	deviceId: z
		.number({
			invalid_type_error: "L'id doit être un nombre",
		})
		.int("L'id de l'appareil doit être un nombre entier")
		.positive("L'id de l'appareil fourni est incorrect")
		.nullable()
		.optional(),
});

export const linesImportSchema = z.array(
	z.strictObject({
		Numéro: z
			.string({
				required_error: 'Le numéro doit être renseigné',
				invalid_type_error:
					'Le numéro doit être une chaîne de caractères',
			})
			.length(10, 'Le numéro doit faire 10 caractères'),
		Profil: z.enum(['V', 'D', 'VD'], {
			errorMap: () => {
				return {
					message: 'Le profil doit être V, D ou VD',
				};
			},
		}),
		Statut: z.enum(['Active', 'En cours', 'Résiliée'], {
			errorMap: () => {
				return {
					message:
						'Le statut doit être Attribuée, En cours ou Résiliée',
				};
			},
		}),
		Commentaires: z
			.string({
				invalid_type_error:
					'Les commentaires doivent être une chaîne de caractères',
			})
			.nullable()
			.optional(),
		Propriétaire: z
			.string({
				invalid_type_error:
					'Le propriétaire doit être une chaîne de caractère',
			})
			.email("Le format de l'adresse mail est incorrect")
			.nullable()
			.optional(),
		Appareil: z
			.string({
				invalid_type_error: "L'IMEI doit être une chaîne de caractères",
			})
			.length(15, "L'IMEI fourni est incorrect")
			.nullable()
			.optional(),
	})
);
