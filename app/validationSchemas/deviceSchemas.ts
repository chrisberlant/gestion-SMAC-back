import { z } from 'zod';
import selectionSchema from '.';

export const deviceCreationSchema = z.strictObject({
	imei: z
		.string({
			required_error: "L'IMEI doit être renseigné",
			invalid_type_error: "L'IMEI doit être une chaîne de caractères",
		})
		.length(15, "L'IMEI fourni est incorrect"),
	preparationDate: z
		.string({
			invalid_type_error:
				'Le format de la date de préparation est incorrect',
		})
		.refine((dateString) => /^\d{4}-\d{2}-\d{2}$/.test(dateString), {
			message: 'Le format de la date de préparation est incorrect',
		})
		.nullable()
		.optional(),
	attributionDate: z
		.string({
			invalid_type_error:
				"Le format de la date d'attribution est incorrect",
		})
		.refine((dateString) => /^\d{4}-\d{2}-\d{2}$/.test(dateString), {
			message: "Le format de la date d'attribution est incorrect",
		})
		.nullable()
		.optional(),
	status: z.enum(
		[
			'En stock',
			'Attribué',
			'Restitué',
			'En attente de restitution',
			'En prêt',
			'En panne',
			'Volé',
		],
		{
			errorMap: () => {
				return {
					message:
						'Le statut doit être Attribué, Restitué, En attente de restitution, En prêt, En panne, ou Volé',
				};
			},
		}
	),
	isNew: z.boolean({
		required_error: 'La valeur isNew doit être renseignée',
		invalid_type_error: 'La valeur isNew doit être un booléen',
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
			invalid_type_error: "L'id de l'agent doit être un nombre",
		})
		.int("L'id de l'agent doit être un nombre entier")
		.positive("L'id de l'agent fourni est incorrect")
		.nullable()
		.optional(),
	modelId: z
		.number({
			required_error: 'Le modèle doit être renseigné',
			invalid_type_error: "L'id du modèle doit être un nombre",
		})
		.int("L'id du modèle doit être un nombre entier")
		.positive("L'id du modèle fourni est incorrect"),
});

export const deviceUpdateSchema = selectionSchema.extend({
	imei: z
		.string({
			invalid_type_error: "L'IMEI doit être une chaîne de caractères",
		})
		.length(15, "L'IMEI fourni est incorrect")
		.optional(),
	preparationDate: z
		.string({
			invalid_type_error:
				'Le format de la date de préparation est incorrect',
		})
		.refine((dateString) => /^\d{4}-\d{2}-\d{2}$/.test(dateString), {
			message: 'Le format de la date de préparation est incorrect',
		})
		.nullable()
		.optional(),
	attributionDate: z
		.string({
			invalid_type_error:
				"Le format de la date d'attribution est incorrect",
		})
		.refine((dateString) => /^\d{4}-\d{2}-\d{2}$/.test(dateString), {
			message: "Le format de la date d'attribution est incorrect",
		})
		.nullable()
		.optional(),
	status: z
		.enum(
			[
				'En stock',
				'Attribué',
				'Restitué',
				'En attente de restitution',
				'En prêt',
				'En panne',
				'Volé',
			],
			{
				errorMap: () => {
					return {
						message:
							'Le statut doit être Attribué, Restitué, En attente de restitution, En prêt, En panne, ou Volé',
					};
				},
			}
		)
		.optional(),
	isNew: z
		.boolean({
			invalid_type_error: 'La valeur isNew doit être un booléen',
		})
		.optional(),
	comments: z
		.string({
			invalid_type_error:
				'Les commentaires doivent être une chaîne de caractères',
		})
		.nullable()
		.optional(),
	agentId: z
		.number({
			invalid_type_error: "L'id de l'agent doit être un nombre",
		})
		.int("L'id de l'agent doit être un nombre entier")
		.positive("L'id de l'agent fourni est incorrect")
		.nullable()
		.optional(),
	modelId: z
		.number({
			invalid_type_error: "L'id du modèle doit être un nombre",
		})
		.int("L'id du modèle doit être un nombre entier")
		.positive("L'id du modèle fourni est incorrect")
		.optional(),
});
