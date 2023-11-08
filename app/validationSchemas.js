import Joi from 'joi';

// Schema used to select anything using its id
export const selectionSchema = Joi.object({
	id: Joi.string().uuid().required().messages({
		'any.required': "L'id doit être renseigné.",
		'string.empty': "L'id doit être renseigné.",
		'string.guid': "Le format de l'id est incorrect.",
	}),
}).options({ stripUnknown: true });

// User validation schemas
export const userLoginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'any.required': "L'adresse email doit être renseignée.",
		'string.empty': "L'adresse email doit être renseignée.",
		'string.email': "L'adresse email doit être valide.",
	}),
	password: Joi.string()
		.min(8)
		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/)
		.required()
		.messages({
			'any.required': 'Le mot de passe doit être renseigné.',
			'string.empty': 'Le mot de passe doit être renseigné.',
			'string.min': "L'identifiant ou le mot de passe est incorrect.",
			'string.pattern.base':
				"L'identifiant ou le mot de passe est incorrect.",
		}),
}).options({ stripUnknown: true });

export const userRegistrationSchema = Joi.object({
	email: Joi.string().email().required().messages({
		'any.required': "L'adresse email doit être renseignée.",
		'string.email': "L'adresse email doit être valide.",
	}),
	lastName: Joi.string()
		.regex(/^[a-zA-ZÀ-ÿ' -]+$/)
		.required()
		.messages({
			'any.required': 'Le nom doit être renseigné.',
			'string.empty': 'Le nom doit être renseigné',
			'string.pattern.base': 'Le nom contient des caractères invalides.',
		}),
	firstName: Joi.string()
		.regex(/^[a-zA-ZÀ-ÿ' -]+$/)
		.required()
		.messages({
			'any.required': 'Le prénom doit être renseigné.',
			'string.empty': 'Le prénom doit être renseigné.',
			'string.pattern.base':
				'Le prénom contient des caractères invalides.',
		}),
	password: Joi.string()
		.min(8)
		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/)
		.required()
		.messages({
			'any.required': 'Le mot de passe doit être renseigné.',
			'string.empty': 'Le mot de passe doit être renseigné.',
			'string.min':
				'Le mot de passe doit contenir au moins {#limit} caractères.',
			'string.pattern.base':
				'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et caractère spécial.',
		}),
	confirmPassword: Joi.string()
		.valid(Joi.ref('password'))
		.required()
		.messages({
			'any.required': 'La confirmation doit être renseignée.',
			'string.empty': 'La confirmation doit être renseignée.',
			'any.only': 'Le mot de passe et sa confirmation sont différents.',
		}),
}).options({ stripUnknown: true });

export const userModificationSchema = Joi.object({
	email: Joi.string().email().messages({
		'any.null': "L'adresse email ne peut pas être vide.",
		'string.email': "L'adresse email doit être valide.",
	}),
	firstName: Joi.string()
		.regex(/^[a-zA-ZÀ-ÿ' -]+$/)
		.messages({
			'string.pattern.base':
				'Le prénom contient des caractères invalides.',
			'string.empty': 'Le prénom ne peut pas être vide.',
		}),
	lastName: Joi.string()
		.regex(/^[a-zA-ZÀ-ÿ' -]+$/)
		.messages({
			'string.pattern.base': 'Le nom contient des caractères invalides.',
			'string.empty': 'Le nom ne peut pas être vide.',
		}),
	address: Joi.string().allow(''),
	// avatarUrl: Joi.string().uri().allow('').messages({
	//   'string.uri': 'L\'avatar doit avoir une adresse valide.'
	// })
}).options({ stripUnknown: true });

export const passwordModificationSchema = Joi.object({
	oldPassword: Joi.string()
		.min(8)
		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/)
		.required()
		.messages({
			'any.required': "L'ancien mot de passe doit être renseigné.",
			'string.empty': "L'ancien mot de passe doit être renseigné.",
			'string.min': "L'ancien mot de passe est incorrect.",
			'string.pattern.base': "L'ancien mot de passe est incorrect.",
		}),
	newPassword: Joi.string()
		.min(8)
		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/)
		.required()
		.messages({
			'any.required': 'Le nouveau mot de passe doit être renseigné.',
			'string.empty': 'Le nouveau mot de passe doit être renseigné.',
			'string.min':
				'Le nouveau mot de passe doit contenir au moins {#limit} caractères.',
			'string.pattern.base':
				'Le nouveau mot de passe doit contenir une majuscule, une minuscule, un chiffre et caractère spécial.',
		}),
	confirmPassword: Joi.string()
		.required()
		.valid(Joi.ref('newPassword'))
		.messages({
			'any.required': 'La confirmation doit être renseignée.',
			'string.empty': 'La confirmation doit être renseigné.',
			'any.only':
				'Le nouveau mot de passe et sa confirmation sont différents.',
		}),
}).options({ stripUnknown: true });

export const userDeletionSchema = Joi.object({
	password: Joi.string()
		.min(8)
		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/)
		.required()
		.messages({
			'any.required': 'Le mot de passe doit être renseigné.',
			'string.empty': 'Le mot de passe doit être renseigné.',
			'string.min': 'Le mot de passe est incorrect.',
			'string.pattern.base': 'Le mot de passe est incorrect.',
		}),
}).options({ stripUnknown: true });

// Card validation schemas
export const cardCreationSchema = Joi.object({
	title: Joi.string().required().messages({
		'any.required': 'Le titre doit être renseigné.',
		'string.empty': 'Le titre doit être renseigné.',
	}),
	category: Joi.string()
		.valid(
			'Mes offres',
			'Mes candidatures',
			'Mes relances',
			'Mes entretiens'
		)
		.required()
		.messages({
			'any.required': 'La catégorie doit être renseignée.',
			'any.only':
				'La catégorie doit être au choix : Mes offres, Mes candidatures, Mes relances ou Mes entretiens.',
		}),
	enterpriseName: Joi.string().required().messages({
		'any.required': "L'entreprise doit être renseignée.",
		'string.empty': "L'entreprise doit être renseignée.",
	}),
	enterpriseActivity: Joi.string().allow(''),
	contractType: Joi.string()
		.valid('CDI', 'CDD', 'Alternance', 'Autre')
		.required()
		.messages({
			'any.required': 'Le type de contrat doit être renseigné.',
			'any.only':
				'La catégorie doit être au choix : CDI, CDD, Alternance ou Autre.',
		}),
	offerUrl: Joi.string().uri().allow('').messages({
		'string.uri': "Le lien de l'offre doit être une adresse valide.",
	}),
	location: Joi.string().allow(''),
	salary: Joi.string().allow(''),
	jobTitle: Joi.string().allow(''),
	rating: Joi.number().integer().min(0).max(5).messages({
		'number.base': 'La note doit être un entier compris entre 0 et 5.',
	}),
	color: Joi.string(),
	comments: Joi.string().allow(''),
	// reminder: Joi.date().allow(''),
	// logoUrl: Joi.string().uri().allow('').messages({
	//   'string.uri': 'Le lien du logo doit avoir une adresse valide.'
	// })
}).options({ stripUnknown: true });

export const cardModificationSchema = Joi.object({
	id: Joi.string().uuid().required().messages({
		'any.required': "L'id doit être renseigné.",
		'string.empty': "L'id doit être renseigné.",
		'string.guid': "Le format de l'id est incorrect.",
	}),
	title: Joi.string(),
	category: Joi.string()
		.valid(
			'Mes offres',
			'Mes candidatures',
			'Mes relances',
			'Mes entretiens'
		)
		.messages({
			'any.only':
				'La catégorie doit être au choix : Mes offres, Mes candidatures, Mes relances ou Mes entretiens.',
		}),
	enterpriseName: Joi.string(),
	enterpriseActivity: Joi.string().allow(''),
	contractType: Joi.string()
		.valid('CDI', 'CDD', 'Alternance', 'Autre')
		.messages({
			'any.only':
				'La catégorie doit être au choix : CDI, CDD, Alternance ou Autre.',
		}),
	offerUrl: Joi.string().uri().allow('').messages({
		'string.uri': "Le lien de l'offre doit être une adresse valide.",
	}),
	location: Joi.string().allow(''),
	salary: Joi.string().allow(''),
	jobTitle: Joi.string().allow(''),
	rating: Joi.number().integer().min(0).max(5).messages({
		'number.base': 'La note doit être un nombre compris entre 0 et 5.',
		'number.min': 'La note doit être supérieure ou égale à 0.',
		'number.max': 'La note doit être inférieure ou égale à 5.',
	}),
	color: Joi.string().messages({
		'string.empty': 'La couleur ne doit pas être vide.',
	}),
	comments: Joi.string().allow(''),
	// reminder: Joi.date().allow(''),
	// logoUrl: Joi.string().uri().allow('').messages({
	//   'string.uri': 'Le lien du logo doit avoir une adresse valide.'
	// })
}).options({ stripUnknown: true });

export const cardMovingSchema = Joi.object({
	id: Joi.string().uuid().required().messages({
		'any.required': "L'id doit être renseigné.",
		'string.empty': "L'id doit être renseigné.",
		'string.guid': "Le format de l'id est incorrect.",
	}),
	newIndex: Joi.number().integer().min(0).required().messages({
		'any.required': "L'index doit être renseigné.",
		'number.min': "L'index doit être supérieur ou égal à 0.",
	}),
	newCategory: Joi.string()
		.valid(
			'Mes offres',
			'Mes candidatures',
			'Mes relances',
			'Mes entretiens'
		)
		.required()
		.messages({
			'any.only':
				'La catégorie doit être au choix : Mes offres, Mes candidatures, Mes relances ou Mes entretiens.',
		}),
}).options({ stripUnknown: true });

// Contact validation schemas
export const contactCreationSchema = Joi.object({
	firstName: Joi.string()
		.regex(/^[a-zA-ZÀ-ÿ' -]+$/)
		.required()
		.messages({
			'any.required': 'Le prénom doit être renseigné.',
			'string.empty': 'Le prénom doit être renseigné.',
			'string.pattern.base':
				'Le prénom contient des caractères invalides.',
		}),
	lastName: Joi.string()
		.regex(/^[a-zA-ZÀ-ÿ' -]+$/)
		.required()
		.messages({
			'any.required': 'Le nom doit être renseigné.',
			'string.empty': 'Le nom doit être renseigné.',
			'string.pattern.base': 'Le nom contient des caractères invalides.',
		}),
	occupation: Joi.string().allow(''),
	email: Joi.string().email().allow('').messages({
		'string.email': "L'adresse email doit être valide.",
	}),
	phone: Joi.string()
		.regex(/^(\+|\d{1,3})([\s.-]?\d+)+$/)
		.allow('')
		.messages({
			'string.pattern.base':
				"Le format du numéro de téléphone n'est pas valide.",
		}),
	linkedinProfile: Joi.string().uri().allow('').messages({
		'string.uri': 'Le profil LinkedIn doit être une adresse valide.',
	}),
	enterprise: Joi.string().allow(''),
	comments: Joi.string().allow(''),
	color: Joi.string().messages({
		'string.empty': 'La couleur ne doit pas être vide.',
	}),
}).options({ stripUnknown: true });

export const contactModificationSchema = Joi.object({
	id: Joi.string().uuid().required().messages({
		'any.required': "L'id doit être renseigné.",
		'string.empty': "L'id doit être renseigné.",
		'string.guid': "Le format de l'id est incorrect.",
	}),
	firstName: Joi.string()
		.regex(/^[a-zA-ZÀ-ÿ' -]+$/)
		.messages({
			'string.empty': 'Le prénom doit être renseigné.',
			'string.pattern.base':
				'Le prénom contient des caractères invalides.',
		}),
	lastName: Joi.string()
		.regex(/^[a-zA-ZÀ-ÿ' -]+$/)
		.messages({
			'string.empty': 'Le nom doit être renseigné.',
			'string.pattern.base': 'Le nom contient des caractères invalides.',
		}),
	occupation: Joi.string().allow(''),
	email: Joi.string().email().allow('').messages({
		'string.email': "L'adresse email doit être valide.",
	}),
	phone: Joi.string()
		.regex(/^(\+|\d{1,3})([\s.-]?\d+)+$/)
		.allow('')
		.messages({
			'string.pattern.base':
				"Le format du numéro de téléphone n'est pas valide.",
		}),
	linkedinProfile: Joi.string().uri().allow('').messages({
		'string.uri': 'Le profil LinkedIn doit être une adresse valide.',
	}),
	enterprise: Joi.string().allow(''),
	comments: Joi.string().allow(''),
	color: Joi.string().messages({
		'string.empty': 'La couleur ne doit pas être vide.',
	}),
}).options({ stripUnknown: true });

// Document validation schemas
export const documentCreationSchema = Joi.object({
	title: Joi.string().required().messages({
		'any.required': 'Le titre doit être renseigné.',
		'string.empty': 'Le titre doit être renseigné.',
	}),
	type: Joi.string()
		.valid('CV', 'Lettre de motivation', 'Autre')
		.required()
		.messages({
			'any.only':
				'La catégorie doit être au choix : CV, Lettre de motivation ou Autre.',
			'any.required': 'Le type de document doit être renseigné.',
		}),
}).options({ stripUnknown: true });

export const documentModificationSchema = Joi.object({
	id: Joi.string().uuid().required().messages({
		'any.required': "L'id doit être renseigné.",
		'string.empty': "L'id doit être renseigné.",
		'string.guid': "Le format de l'id est incorrect.",
	}),
	title: Joi.string().messages({
		'string.empty': 'Le titre ne doit pas être vide.',
	}),
	type: Joi.string().valid('CV', 'Lettre de motivation', 'Autre').messages({
		'any.only':
			'La catégorie doit être au choix : CV, Lettre de motivation ou Autre.',
	}),
}).options({ stripUnknown: true });
