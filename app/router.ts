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
router.post(
	'/login',
	requestsLimitMiddleware,
	dataValidation(userLoginSchema),
	userController.login
);
router.post(
	'/register',
	dataValidation(userRegistrationSchema),
	userController.register
);
router.get('/getUserInfos', jwtMiddleware, userController.getUserInfos);
router.patch(
	'/modifyUserInfos',
	jwtMiddleware,
	dataValidation(userModificationSchema),
	userController.modifyUserInfos
);
router.patch(
	'/modifyUserPassword',
	jwtMiddleware,
	dataValidation(passwordModificationSchema),
	userController.modifyUserPassword
);
router.get('/logout', userController.logout);
router.delete(
	'/deleteUser',
	jwtMiddleware,
	dataValidation(userDeletionSchema),
	userController.deleteUser
);

export default router;
