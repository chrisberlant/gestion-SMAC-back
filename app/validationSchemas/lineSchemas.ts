import { z } from 'zod';
import selectionSchema from '.';

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
	status: z.enum(['Attribuée', 'En cours', 'Résiliée'], {
		errorMap: () => {
			return {
				message: 'Le statut doit être Attribuée, En cours ou Résiliée',
			};
		},
	}),
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

export const lineUpdateSchema = selectionSchema.extend({
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
		.enum(['Attribuée', 'En cours', 'Résiliée'], {
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
