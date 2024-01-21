import { Router } from 'express';
import authController from './controllers/authController';
import deviceController from './controllers/deviceController';
import lineController from './controllers/lineController';
import modelController from './controllers/modelController';
import serviceController from './controllers/serviceController';
import statsController from './controllers/statsController';
import userController from './controllers/userController';
import adminMiddleware from './middlewares/adminMiddleware';
import dataValidation from './middlewares/dataValidationMiddleware';
import jwtMiddleware from './middlewares/jwtMidleware';
import requestsLimitMiddleware from './middlewares/requestsLimitMiddleware';
import selectionSchema from './validationSchemas';
import {
	lineCreationSchema,
	lineUpdateSchema,
} from './validationSchemas/lineSchemas';
import {
	modelCreationSchema,
	modelUpdateSchema,
} from './validationSchemas/modelSchemas';
import {
	serviceCreationSchema,
	serviceUpdateSchema,
} from './validationSchemas/serviceSchemas';
import {
	currentUserPasswordUpdateSchema,
	currentUserUpdateSchema,
	userCreationSchema,
	userLoginSchema,
	userUpdateSchema,
} from './validationSchemas/userSchemas';

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
router.get('/getAllLines/', jwtMiddleware, lineController.getAllLines);
router.get('/getLineById/:id', jwtMiddleware, lineController.getLineById);
router.post(
	'/createLine',
	jwtMiddleware,
	dataValidation(lineCreationSchema),
	lineController.createLine
);
router.patch(
	'/updateLine',
	jwtMiddleware,
	dataValidation(lineUpdateSchema),
	lineController.updateLine
);
router.delete(
	'/deleteLine',
	jwtMiddleware,
	dataValidation(selectionSchema),
	lineController.deleteLine
);

/* ------------- DEVICES ROUTES ------------- */

router.get('/getAllDevices', jwtMiddleware, deviceController.getAllDevices);
router.get('/getDeviceById/:id', jwtMiddleware, deviceController.getDeviceById);

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
