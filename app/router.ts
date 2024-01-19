import { Router } from 'express';
import jwtMiddleware from './middlewares/jwtMidleware';
import requestsLimitMiddleware from './middlewares/requestsLimitMiddleware';
import userController from './controllers/userController';
import lineController from './controllers/lineController';
import dataValidation from './middlewares/dataValidationMiddleware';
import {
	userLoginSchema,
	currentUserUpdateSchema,
	currentUserPasswordUpdateSchema,
	userUpdateSchema,
	userCreationSchema,
} from './validationSchemas/userSchemas';
import adminMiddleware from './middlewares/adminMiddleware';
import selectionSchema from './validationSchemas';
import authController from './controllers/authController';
import deviceController from './controllers/deviceController';
import serviceController from './controllers/serviceController';
import modelController from './controllers/modelController';
import lineStatusSchema from './validationSchemas/lineSchemas';
import statsController from './controllers/statsController';
import {
	modelCreationSchema,
	modelUpdateSchema,
} from './validationSchemas/modelSchemas';
import {
	serviceCreationSchema,
	serviceUpdateSchema,
} from './validationSchemas/serviceSchemas';

const router = Router();

/* ------------- AUTH ROUTES ------------- */
router.post(
	'/login',
	requestsLimitMiddleware,
	dataValidation(userLoginSchema),
	authController.login
);
router.get('/logout', authController.logout);

// Route used to check if server is online
router.get('/healthCheck', authController.healthCheck);

/* ------------- USER ROUTES ------------- */
router.get('/getCurrentUser', jwtMiddleware, userController.getCurrentUser);
router.patch(
	'/updateCurrentUser',
	jwtMiddleware,
	dataValidation(currentUserUpdateSchema),
	userController.updateCurrentUser
);
router.patch(
	'/updateCurrentUserPassword',
	jwtMiddleware,
	dataValidation(currentUserPasswordUpdateSchema),
	userController.updateCurrentUserPassword
);

/* ------------- LINES ROUTES ------------- */
router.get(
	'/getAllLines/:status',
	jwtMiddleware,
	dataValidation(lineStatusSchema),
	lineController.getAllLines
);
router.get(
	'/getLineById/:id',
	jwtMiddleware,
	dataValidation(selectionSchema),
	lineController.getLineById
);

/* ------------- DEVICES ROUTES ------------- */

router.get('/getAllDevices', jwtMiddleware, deviceController.getAllDevices);
router.get(
	'/getDeviceById/:id',
	jwtMiddleware,
	dataValidation(selectionSchema),
	deviceController.getDeviceById
);

/* ------------- MODELS ROUTES ------------- */
router.get('/getAllModels', jwtMiddleware, modelController.getAllModels);

/* ------------- SERVICES ROUTES ------------- */
router.get('/getAllServices', jwtMiddleware, serviceController.getAllServices);

/* ------------- STATS ROUTES ------------- */
router.get(
	'/getAgentsAndDevicesPerService',
	jwtMiddleware,
	statsController.getAgentsAndDevicesPerService
);
router.get(
	'/getDevicesAmountPerModel',
	jwtMiddleware,
	statsController.getDevicesAmountPerModel
);

/* ------------- ADMIN ROUTES ------------- */
router.get(
	'/getAllUsers',
	jwtMiddleware,
	adminMiddleware,
	userController.getAllUsers
);
router.post(
	'/createUser',
	jwtMiddleware,
	dataValidation(userCreationSchema),
	adminMiddleware,
	userController.createUser
);
router.patch(
	'/updateUser',
	jwtMiddleware,
	dataValidation(userUpdateSchema),
	adminMiddleware,
	userController.updateUser
);
router.delete(
	'/deleteUser',
	jwtMiddleware,
	dataValidation(selectionSchema),
	adminMiddleware,
	userController.deleteUser
);
router.patch(
	'/resetPassword',
	jwtMiddleware,
	dataValidation(selectionSchema),
	adminMiddleware,
	userController.resetPassword
);
router.post(
	'/createModel',
	jwtMiddleware,
	dataValidation(modelCreationSchema),
	adminMiddleware,
	modelController.createModel
);
router.patch(
	'/updateModel',
	jwtMiddleware,
	dataValidation(modelUpdateSchema),
	adminMiddleware,
	modelController.updateModel
);
router.delete(
	'/deleteModel',
	jwtMiddleware,
	dataValidation(selectionSchema),
	adminMiddleware,
	modelController.deleteModel
);
router.post(
	'/createService',
	jwtMiddleware,
	dataValidation(serviceCreationSchema),
	serviceController.createService
);
router.put(
	'/updateService',
	jwtMiddleware,
	dataValidation(serviceUpdateSchema),
	serviceController.updateService
);
router.delete(
	'/deleteService',
	jwtMiddleware,
	dataValidation(selectionSchema),
	serviceController.deleteService
);

export default router;
