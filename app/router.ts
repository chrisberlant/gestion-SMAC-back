import { Router } from 'express';
import jwtMiddleware from './middlewares/jwtMidleware.ts';
import requestsLimitMiddleware from './middlewares/requestsLimitMiddleware.ts';
import userController from './controllers/userController.ts';
import lineController from './controllers/lineController.ts';
import adminController from './controllers/adminController.ts';
import dataValidation from './middlewares/dataValidationMiddleware.ts';
import {
	userLoginSchema,
	userModificationSchema,
	userRegistrationSchema,
	passwordModificationSchema,
} from './validationSchemas/userSchemas.ts';
import { userRightsModificationSchema } from './validationSchemas/userSchemas.ts';
import adminMiddleware from './middlewares/adminMiddleware.ts';
import selectionSchema from './validationSchemas/index.ts';
import authController from './controllers/authController.ts';

const router = Router();

/* ------------- AUTH ROUTES ------------- */
router.post(
	'/login',
	requestsLimitMiddleware,
	dataValidation(userLoginSchema),
	authController.login
);
router.get('/logout', authController.logout);
// ! Route used to create the first user
router.post(
	'/register',
	dataValidation(userRegistrationSchema),
	authController.register
);

/* ------------- USER ROUTES ------------- */
router.get(
	'/getCurrentUserInfos',
	jwtMiddleware,
	userController.getCurrentUserInfos
);
router.patch(
	'/modifyUserInfos',
	jwtMiddleware,
	dataValidation(userModificationSchema),
	userController.modifyCurrentUserInfos
);
router.patch(
	'/modifyCurrentUserPassword',
	jwtMiddleware,
	dataValidation(passwordModificationSchema),
	userController.modifyCurrentUserPassword
);

/* ------------- LINES ROUTES ------------- */
router.get('/getAllLines/:status', jwtMiddleware, lineController.getAllLines);

/* ------------- ADMIN ROUTES ------------- */
router.post(
	'/createNewUser',
	jwtMiddleware,
	adminMiddleware,
	adminController.createNewUser
);
router.patch(
	'/modifyUserRights',
	jwtMiddleware,
	adminMiddleware,
	dataValidation(userRightsModificationSchema),
	adminController.modifyUserRights
);
router.delete(
	'/deleteUser',
	jwtMiddleware,
	adminMiddleware,
	dataValidation(selectionSchema),
	adminController.deleteUser
);
router.post(
	'/createNewModel',
	jwtMiddleware,
	adminMiddleware,
	adminController.createNewModel
);
router.patch(
	'/modifyModel',
	jwtMiddleware,
	adminMiddleware,
	adminController.modifyModel
);
router.delete(
	'/deleteModel',
	jwtMiddleware,
	adminMiddleware,
	adminController.deleteModel
);

export default router;
