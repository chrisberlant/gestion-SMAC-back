import { Router } from 'express';
import jwtMiddleware from './middlewares/jwtMidleware.ts';
import requestsLimitMiddleware from './middlewares/requestsLimitMiddleware.ts';
import userController from './controllers/userController.ts';
import dataValidation from './middlewares/dataValidationMiddleware.ts';
import {
	userLoginSchema,
	userModificationSchema,
	userRegistrationSchema,
	passwordModificationSchema,
	userDeletionSchema,
} from './validationSchemas.js';

const router = Router();

/* ------------- USER/AUTH ROUTES ------------- */
router.post('/login', requestsLimitMiddleware, userController.login);
// Route used to create the first user
// router.post('/register', userController.register);
export default router;
