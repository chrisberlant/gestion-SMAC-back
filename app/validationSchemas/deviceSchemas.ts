import { z } from 'zod';

interface DeviceType {
	id?: number;
	imei: string;
	preparationDate?: Date;
	attributiontionDate?: Date;
	status: string;
	condition: string;
	comments?: string;
}

export const deviceCreationSchema = z.object({
	imei: z
		.string({
			required_error: "L'IMEI doit être renseigné",
			invalid_type_error: "L'IMEI doit être une chaîne de caractères",
		})
		.length(15, { message: "L'IMEI fourni est incorrect" }),
	preparationDate: z.date().optional(),
	attributionDate: z.date().optional(),
	status: z.enum([
		'Attribué',
		'Restitué',
		'En attente de restitution',
		'En prêt',
		'En panne',
		'Vol',
	]),
	condition: z.enum(['Neuf', 'Reconditionné']),
	comments: z
		.string({
			invalid_type_error:
				'Les commentaires doivent être une chaîne de caractères',
		})
		.optional(),
});

export const deviceModificationSchema = z.object({
	imei: z
		.string({
			invalid_type_error: "L'IMEI doit être une chaîne de caractères",
		})
		.length(15, { message: "L'IMEI fourni est incorrect" })
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
			'Vol',
		])
		.optional(),
	condition: z.enum(['Neuf', 'Reconditionné']).optional(),
	comments: z
		.string({
			invalid_type_error:
				'Les commentaires doivent être une chaîne de caractères',
		})
		.optional(),
});
