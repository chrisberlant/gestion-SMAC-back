import { Router } from 'express';
import agentController from './controllers/agentController';
import authController from './controllers/authController';
import deviceController from './controllers/deviceController';
import lineController from './controllers/lineController';
import modelController from './controllers/modelController';
import serviceController from './controllers/serviceController';
import statsController from './controllers/statsController';
import userController from './controllers/userController';
import rightsMiddleware from './middlewares/rightsMiddleware';
import dataValidation from './middlewares/dataValidationMiddleware';
import jwtMiddleware from './middlewares/jwtMidleware';
import requestsLimitMiddleware from './middlewares/requestsLimitMiddleware';
import selectionSchema from './validationSchemas';
import {
	agentCreationSchema,
	agentUpdateSchema,
} from './validationSchemas/agentSchemas';
import {
	deviceCreationSchema,
	deviceUpdateSchema,
} from './validationSchemas/deviceSchemas';
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

// Route used to check if server is online
router.get('/healthCheck', authController.healthCheck);

/* ------------- LOGGED USER ROUTES ------------- */
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

/* ------------- APP USERS ROUTES (ADMIN) ------------- */
router.get(
	'/getAllUsers',
	jwtMiddleware,
	rightsMiddleware('Admin'),
	userController.getAllUsers
);
router.post(
	'/createUser',
	jwtMiddleware,
	dataValidation(userCreationSchema),
	rightsMiddleware('Admin'),
	userController.createUser
);
router.patch(
	'/updateUser',
	jwtMiddleware,
	dataValidation(userUpdateSchema),
	rightsMiddleware('Admin'),
	userController.updateUser
);
router.delete(
	'/deleteUser',
	jwtMiddleware,
	dataValidation(selectionSchema),
	rightsMiddleware('Admin'),
	userController.deleteUser
);
router.patch(
	'/resetPassword',
	jwtMiddleware,
	dataValidation(selectionSchema),
	rightsMiddleware('Admin'),
	userController.resetPassword
);

/* ------------- LINES ROUTES ------------- */
router.get('/getAllLines/', jwtMiddleware, lineController.getAllLines);
router.get('/getLineById/:id', jwtMiddleware, lineController.getLineById);
router.post(
	'/createLine',
	jwtMiddleware,
	dataValidation(lineCreationSchema),
	rightsMiddleware('Tech'),
	lineController.createLine
);
router.patch(
	'/updateLine',
	jwtMiddleware,
	dataValidation(lineUpdateSchema),
	rightsMiddleware('Tech'),
	lineController.updateLine
);
router.delete(
	'/deleteLine',
	jwtMiddleware,
	dataValidation(selectionSchema),
	rightsMiddleware('Tech'),
	lineController.deleteLine
);

/* ------------- DEVICES ROUTES ------------- */

router.get('/getAllDevices', jwtMiddleware, deviceController.getAllDevices);
router.get('/getDeviceById/:id', jwtMiddleware, deviceController.getDeviceById);
router.post(
	'/createDevice',
	jwtMiddleware,
	dataValidation(deviceCreationSchema),
	rightsMiddleware('Tech'),
	deviceController.createDevice
);
router.patch(
	'/updateDevice',
	jwtMiddleware,
	dataValidation(deviceUpdateSchema),
	rightsMiddleware('Tech'),
	deviceController.updateDevice
);
router.delete(
	'/deleteDevice',
	jwtMiddleware,
	dataValidation(selectionSchema),
	rightsMiddleware('Tech'),
	deviceController.deleteDevice
);

/* ------------- MODELS ROUTES ------------- */
router.get('/getAllModels', jwtMiddleware, modelController.getAllModels);

/* ------------- MODELS ROUTES (ADMIN) ------------- */
router.post(
	'/createModel',
	jwtMiddleware,
	dataValidation(modelCreationSchema),
	rightsMiddleware('Admin'),
	modelController.createModel
);
router.patch(
	'/updateModel',
	jwtMiddleware,
	dataValidation(modelUpdateSchema),
	rightsMiddleware('Admin'),
	modelController.updateModel
);
router.delete(
	'/deleteModel',
	jwtMiddleware,
	dataValidation(selectionSchema),
	rightsMiddleware('Admin'),
	modelController.deleteModel
);

/* ------------- AGENTS ROUTES ------------- */
router.get('/getAllAgents', jwtMiddleware, agentController.getAllAgents);
router.post(
	'/createAgent',
	jwtMiddleware,
	dataValidation(agentCreationSchema),
	rightsMiddleware('Tech'),
	agentController.createAgent
);
router.patch(
	'/updateAgent',
	jwtMiddleware,
	dataValidation(agentUpdateSchema),
	rightsMiddleware('Tech'),
	agentController.updateAgent
);
router.delete(
	'/deleteAgent',
	jwtMiddleware,
	dataValidation(selectionSchema),
	rightsMiddleware('Tech'),
	agentController.deleteAgent
);
router.get(
	'/generateAgentsCsvFile',
	jwtMiddleware,
	agentController.generateAgentsCsvFile
);

/* ------------- SERVICES ROUTES ------------- */
router.get('/getAllServices', jwtMiddleware, serviceController.getAllServices);

/* ------------- SERVICES ROUTES (ADMIN) ------------- */
router.post(
	'/createService',
	jwtMiddleware,
	dataValidation(serviceCreationSchema),
	rightsMiddleware('Admin'),
	serviceController.createService
);
router.put(
	'/updateService',
	jwtMiddleware,
	dataValidation(serviceUpdateSchema),
	rightsMiddleware('Admin'),
	serviceController.updateService
);
router.delete(
	'/deleteService',
	jwtMiddleware,
	dataValidation(selectionSchema),
	rightsMiddleware('Admin'),
	serviceController.deleteService
);

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

export default router;
