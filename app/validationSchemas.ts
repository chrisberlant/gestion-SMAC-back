import { z, ZodType } from 'zod';

// User.parse({ username: "Ludwig" });
// type User = z.infer<typeof User>;

// Schema used to select anything using its id
export const selectionSchema: ZodType = z.object({
	id: z.number().int().min(1, { message: "L'id fourni est incorrect" }),
});

export const userLoginSchema: ZodType = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8, { message: 'Le mot de passe doit faire minimum 8 caractères' }),
});

// User validation schemas
// export const userLoginSchema = Joi.object({
// 	email: Joi.string().email().required().messages({
// 		'any.required': "L'adresse email doit être renseignée.",
// 		'string.empty': "L'adresse email doit être renseignée.",
// 		'string.email': "L'adresse email doit être valide.",
// 	}),
// 	password: Joi.string()
// 		.min(8)
// 		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/)
// 		.required()
// 		.messages({
// 			'any.required': 'Le mot de passe doit être renseigné.',
// 			'string.empty': 'Le mot de passe doit être renseigné.',
// 			'string.min': "L'identifiant ou le mot de passe est incorrect.",
// 			'string.pattern.base':
// 				"L'identifiant ou le mot de passe est incorrect.",
// 		}),
// }).options({ stripUnknown: true });

// export const userRegistrationSchema = Joi.object({
// 	email: Joi.string().email().required().messages({
// 		'any.required': "L'adresse email doit être renseignée.",
// 		'string.email': "L'adresse email doit être valide.",
// 	}),
// 	lastName: Joi.string()
// 		.regex(/^[a-zA-ZÀ-ÿ' -]+$/)
// 		.required()
// 		.messages({
// 			'any.required': 'Le nom doit être renseigné.',
// 			'string.empty': 'Le nom doit être renseigné',
// 			'string.pattern.base': 'Le nom contient des caractères invalides.',
// 		}),
// 	firstName: Joi.string()
// 		.regex(/^[a-zA-ZÀ-ÿ' -]+$/)
// 		.required()
// 		.messages({
// 			'any.required': 'Le prénom doit être renseigné.',
// 			'string.empty': 'Le prénom doit être renseigné.',
// 			'string.pattern.base':
// 				'Le prénom contient des caractères invalides.',
// 		}),
// 	password: Joi.string()
// 		.min(8)
// 		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/)
// 		.required()
// 		.messages({
// 			'any.required': 'Le mot de passe doit être renseigné.',
// 			'string.empty': 'Le mot de passe doit être renseigné.',
// 			'string.min':
// 				'Le mot de passe doit contenir au moins {#limit} caractères.',
// 			'string.pattern.base':
// 				'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et caractère spécial.',
// 		}),
// 	confirmPassword: Joi.string()
// 		.valid(Joi.ref('password'))
// 		.required()
// 		.messages({
// 			'any.required': 'La confirmation doit être renseignée.',
// 			'string.empty': 'La confirmation doit être renseignée.',
// 			'any.only': 'Le mot de passe et sa confirmation sont différents.',
// 		}),
// }).options({ stripUnknown: true });

// export const userModificationSchema = Joi.object({
// 	email: Joi.string().email().messages({
// 		'any.null': "L'adresse email ne peut pas être vide.",
// 		'string.email': "L'adresse email doit être valide.",
// 	}),
// 	firstName: Joi.string()
// 		.regex(/^[a-zA-ZÀ-ÿ' -]+$/)
// 		.messages({
// 			'string.pattern.base':
// 				'Le prénom contient des caractères invalides.',
// 			'string.empty': 'Le prénom ne peut pas être vide.',
// 		}),
// 	lastName: Joi.string()
// 		.regex(/^[a-zA-ZÀ-ÿ' -]+$/)
// 		.messages({
// 			'string.pattern.base': 'Le nom contient des caractères invalides.',
// 			'string.empty': 'Le nom ne peut pas être vide.',
// 		}),
// 	address: Joi.string().allow(''),
// 	// avatarUrl: Joi.string().uri().allow('').messages({
// 	//   'string.uri': 'L\'avatar doit avoir une adresse valide.'
// 	// })
// }).options({ stripUnknown: true });

// export const passwordModificationSchema = Joi.object({
// 	oldPassword: Joi.string()
// 		.min(8)
// 		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/)
// 		.required()
// 		.messages({
// 			'any.required': "L'ancien mot de passe doit être renseigné.",
// 			'string.empty': "L'ancien mot de passe doit être renseigné.",
// 			'string.min': "L'ancien mot de passe est incorrect.",
// 			'string.pattern.base': "L'ancien mot de passe est incorrect.",
// 		}),
// 	newPassword: Joi.string()
// 		.min(8)
// 		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/)
// 		.required()
// 		.messages({
// 			'any.required': 'Le nouveau mot de passe doit être renseigné.',
// 			'string.empty': 'Le nouveau mot de passe doit être renseigné.',
// 			'string.min':
// 				'Le nouveau mot de passe doit contenir au moins {#limit} caractères.',
// 			'string.pattern.base':
// 				'Le nouveau mot de passe doit contenir une majuscule, une minuscule, un chiffre et caractère spécial.',
// 		}),
// 	confirmPassword: Joi.string()
// 		.required()
// 		.valid(Joi.ref('newPassword'))
// 		.messages({
// 			'any.required': 'La confirmation doit être renseignée.',
// 			'string.empty': 'La confirmation doit être renseigné.',
// 			'any.only':
// 				'Le nouveau mot de passe et sa confirmation sont différents.',
// 		}),
// }).options({ stripUnknown: true });

// export const userDeletionSchema = Joi.object({
// 	password: Joi.string()
// 		.min(8)
// 		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/)
// 		.required()
// 		.messages({
// 			'any.required': 'Le mot de passe doit être renseigné.',
// 			'string.empty': 'Le mot de passe doit être renseigné.',
// 			'string.min': 'Le mot de passe est incorrect.',
// 			'string.pattern.base': 'Le mot de passe est incorrect.',
// 		}),
// }).options({ stripUnknown: true });
