import { Router } from 'express';
import jwtMiddleware from './middlewares/jwtMidleware';
import requestsLimitMiddleware from './middlewares/requestsLimitMiddleware';
import userController from './controllers/userController';
import lineController from './controllers/lineController';
import adminController from './controllers/adminController';
import dataValidation from './middlewares/dataValidationMiddleware';
import {
	userLoginSchema,
	userModificationSchema,
	userRegistrationSchema,
	passwordModificationSchema,
	userRightsModificationSchema,
} from './validationSchemas/userSchemas';
import adminMiddleware from './middlewares/adminMiddleware';
import selectionSchema from './validationSchemas';
import authController from './controllers/authController';

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
router.get(
	'/getAdminDashboard',
	// jwtMiddleware,
	// adminMiddleware,
	adminController.getAdminDashboard
);
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
