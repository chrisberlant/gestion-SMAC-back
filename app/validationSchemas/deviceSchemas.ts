import { z } from 'zod';
import selectionSchema from '.';

export const deviceCreationSchema = z.strictObject({
	imei: z
		.string({
			required_error: "L'IMEI doit être renseigné",
			invalid_type_error: "L'IMEI doit être une chaîne de caractères",
		})
		.length(15, "L'IMEI fourni est incorrect"),
	preparationDate: z.date().optional(),
	attributionDate: z.date().optional(),
	status: z.enum([
		'Attribué',
		'Restitué',
		'En attente de restitution',
		'En prêt',
		'En panne',
		'Volé',
	]),
	isNew: z.boolean(),
	comments: z
		.string({
			invalid_type_error:
				'Les commentaires doivent être une chaîne de caractères',
		})
		.optional(),
});

export const deviceModificationSchema = selectionSchema.extend({
	imei: z
		.string({
			invalid_type_error: "L'IMEI doit être une chaîne de caractères",
		})
		.length(15, "L'IMEI fourni est incorrect")
		.optional(),
	preparationDate: z.date().optional(),
	attributionDate: z.date().optional(),
	status: z
		.enum([
			'Attribué',
			'Restitué',
			'En attente de restitution',
			'En prêt',
			'En panne',
			'Volé',
		])
		.optional(),
	isNew: z.boolean().optional(),
	comments: z
		.string({
			invalid_type_error:
				'Les commentaires doivent être une chaîne de caractères',
		})
		.optional(),
});
