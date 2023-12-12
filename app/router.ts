import { Router } from 'express';
import jwtMiddleware from './middlewares/jwtMidleware';
import requestsLimitMiddleware from './middlewares/requestsLimitMiddleware';
import userController from './controllers/userController';
import lineController from './controllers/lineController';
import adminController from './controllers/adminController';
import dataValidation from './middlewares/dataValidationMiddleware';
import {
	userLoginSchema,
	currentUserModificationSchema,
	currentUserPasswordModificationSchema,
	userModificationSchema,
	newUserCreationSchema,
} from './validationSchemas/userSchemas';
import adminMiddleware from './middlewares/adminMiddleware';
import { getByIdSchema, updateByIdSchema } from './validationSchemas';
import authController from './controllers/authController';
import deviceController from './controllers/deviceController';
import serviceController from './controllers/serviceController';
import modelController from './controllers/modelController';
import lineStatusSchema from './validationSchemas/lineSchemas';
import statsController from './controllers/statsController';

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
// router.post(
// 	'/register',
// 	dataValidation(newUserCreationSchema),
// 	authController.register
// );
router.get('/healthCheck', (_, res) => {
	res.status(200).json('Serveur en ligne');
});

/* ------------- USER ROUTES ------------- */
router.get('/getCurrentUser', jwtMiddleware, userController.getCurrentUser);
router.patch(
	'/modifyCurrentUser',
	jwtMiddleware,
	dataValidation(currentUserModificationSchema),
	userController.modifyCurrentUser
);
router.patch(
	'/modifyCurrentUserPassword',
	jwtMiddleware,
	dataValidation(currentUserPasswordModificationSchema),
	userController.modifyCurrentUserPassword
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
	dataValidation(getByIdSchema),
	lineController.getLineById
);

/* ------------- DEVICES ROUTES ------------- */

router.get('/getAllDevices', jwtMiddleware, deviceController.getAllDevices);
router.get(
	'/getDeviceById/:id',
	jwtMiddleware,
	dataValidation(getByIdSchema),
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
	adminController.getAllUsers
);
router.post(
	'/createNewUser',
	jwtMiddleware,
	dataValidation(newUserCreationSchema),
	adminMiddleware,
	adminController.createNewUser
);
router.patch(
	'/modifyUser',
	jwtMiddleware,
	dataValidation(userModificationSchema),
	adminMiddleware,
	adminController.modifyUser
);
router.delete(
	'/deleteUser',
	jwtMiddleware,
	dataValidation(updateByIdSchema),
	adminMiddleware,
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
	dataValidation(updateByIdSchema),
	adminMiddleware,
	adminController.deleteModel
);

export default router;
