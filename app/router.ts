import { Router } from 'express';
import agentController from './controllers/agentController';
import authController from './controllers/authController';
import deviceController from './controllers/deviceController';
import lineController from './controllers/lineController';
import modelController from './controllers/modelController';
import serviceController from './controllers/serviceController';
import userController from './controllers/userController';
import statsController from './controllers/statsController';
import historyController from './controllers/historyController';
import rightsMiddleware from './middlewares/rightsMiddleware';
import dataValidation from './middlewares/dataValidationMiddleware';
import jwtMiddleware from './middlewares/jwtMidleware';
import requestsLimitMiddleware from './middlewares/requestsLimitMiddleware';
import {
	agentCreationSchema,
	agentUpdateSchema,
	agentsImportSchema,
} from './validationSchemas/agentSchemas';
import {
	deviceCreationSchema,
	deviceUpdateSchema,
	devicesImportSchema,
} from './validationSchemas/deviceSchemas';
import {
	lineCreationSchema,
	lineUpdateSchema,
	linesImportSchema,
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
// Récupérer les informations de l'utilisateur connecté
router.get('/me', jwtMiddleware, userController.getCurrentUser);
// Modifier les infos
router.patch(
	'/me',
	jwtMiddleware,
	dataValidation(currentUserUpdateSchema),
	userController.updateCurrentUser
);
// Modifier le mot de passe
router.patch(
	'/my-password',
	jwtMiddleware,
	dataValidation(currentUserPasswordUpdateSchema),
	userController.updateCurrentUserPassword
);

/* ------------- APP USERS ROUTES (ADMIN) ------------- */
// Récupérer tous les utilisateurs
router.get(
	'/users',
	jwtMiddleware,
	rightsMiddleware('Admin'),
	userController.getAllUsers
);
// Créer un utilisateur
router.post(
	'/user',
	jwtMiddleware,
	dataValidation(userCreationSchema),
	rightsMiddleware('Admin'),
	userController.createUser
);
// Modifier un utilisateur
router.patch(
	'/user/:id',
	jwtMiddleware,
	dataValidation(userUpdateSchema),
	rightsMiddleware('Admin'),
	userController.updateUser
);
// Supprimer un utilisateur
router.delete(
	'/user/:id',
	jwtMiddleware,
	rightsMiddleware('Admin'),
	userController.deleteUser
);
// Réinitialiser le mot de passe d'un utilisateur
router.patch(
	'/user/password/:id',
	jwtMiddleware,
	rightsMiddleware('Admin'),
	userController.resetPassword
);

/* ------------- LINES ROUTES ------------- */
// Récupérer toutes les lignes
router.get('/lines', jwtMiddleware, lineController.getAllLines);
router.get('/line/:id', jwtMiddleware, lineController.getLineById);
// Créer une ligne
router.post(
	'/line',
	jwtMiddleware,
	dataValidation(lineCreationSchema),
	rightsMiddleware('Tech'),
	lineController.createLine
);
// Modifier une ligne
router.patch(
	'/line/:id',
	jwtMiddleware,
	dataValidation(lineUpdateSchema),
	rightsMiddleware('Tech'),
	lineController.updateLine
);
// Supprimer une ligne
router.delete(
	'/line/:id',
	jwtMiddleware,
	rightsMiddleware('Tech'),
	lineController.deleteLine
);
// Exporter les lignes en CSV
router.get(
	'/lines/csv',
	jwtMiddleware,
	rightsMiddleware('Tech'),
	lineController.generateLinesCsvFile
);
// Créer des lignes à partir d'un CSV
router.post(
	'/lines/csv',
	jwtMiddleware,
	dataValidation(linesImportSchema),
	rightsMiddleware('Tech'),
	lineController.importMultipleLines
);
// Créer un template CSV vierge
router.get(
	'/lines/csv-template',
	jwtMiddleware,
	lineController.generateEmptyLinesCsvFile
);

/* ------------- DEVICES ROUTES ------------- */
// Récupérer tous les appareils
router.get('/devices', jwtMiddleware, deviceController.getAllDevices);
router.get('/device/:id', jwtMiddleware, deviceController.getDeviceById);
// Créer un appareil
router.post(
	'/device',
	jwtMiddleware,
	dataValidation(deviceCreationSchema),
	rightsMiddleware('Tech'),
	deviceController.createDevice
);
// Modifier un appareil
router.patch(
	'/device/:id',
	jwtMiddleware,
	dataValidation(deviceUpdateSchema),
	rightsMiddleware('Tech'),
	deviceController.updateDevice
);
// Supprimer un appareil
router.delete(
	'/device/:id',
	jwtMiddleware,
	rightsMiddleware('Tech'),
	deviceController.deleteDevice
);
// Exporter les appareils en CSV
router.get(
	'/devices/csv',
	jwtMiddleware,
	rightsMiddleware('Tech'),
	deviceController.exportDevicesCsvFile
);
// Créer des appareils à partir d'un CSV
router.post(
	'/devices/csv',
	jwtMiddleware,
	dataValidation(devicesImportSchema),
	rightsMiddleware('Tech'),
	deviceController.importMultipleDevices
);
// Créer un template CSV vierge
router.get(
	'/devices/csv-template',
	jwtMiddleware,
	deviceController.generateEmptyDevicesCsvFile
);

/* ------------- MODELS ROUTES ------------- */
// Récupérer tous les modèles
router.get('/models', jwtMiddleware, modelController.getAllModels);
// Créer un modèle
router.post(
	'/model',
	jwtMiddleware,
	dataValidation(modelCreationSchema),
	rightsMiddleware('Admin'),
	modelController.createModel
);
// Modifier un modèle
router.patch(
	'/model/:id',
	jwtMiddleware,
	dataValidation(modelUpdateSchema),
	rightsMiddleware('Admin'),
	modelController.updateModel
);
// Supprimer un modèle
router.delete(
	'/model/:id',
	jwtMiddleware,
	rightsMiddleware('Admin'),
	modelController.deleteModel
);

/* ------------- AGENTS ROUTES ------------- */
// Récupérer tous les agents
router.get('/agents', jwtMiddleware, agentController.getAllAgents);
// Créer un agent
router.post(
	'/agent',
	jwtMiddleware,
	dataValidation(agentCreationSchema),
	rightsMiddleware('Tech'),
	agentController.createAgent
);
// Modifier un agent
router.patch(
	'/agent/:id',
	jwtMiddleware,
	dataValidation(agentUpdateSchema),
	rightsMiddleware('Tech'),
	agentController.updateAgent
);
// Supprimer un agent
router.delete(
	'/agent/:id',
	jwtMiddleware,
	rightsMiddleware('Tech'),
	agentController.deleteAgent
);
// Exporter les agents en CSV
router.get(
	'/agents/csv',
	jwtMiddleware,
	rightsMiddleware('Tech'),
	agentController.exportAgentsCsvFile
);
// Créer des agents à partir d'un CSV
router.post(
	'/agents/csv',
	jwtMiddleware,
	dataValidation(agentsImportSchema),
	rightsMiddleware('Tech'),
	agentController.importMultipleAgents
);
// Générer le template CSV
router.get(
	'/agents/csv-template',
	jwtMiddleware,
	agentController.generateEmptyAgentsCsvFile
);

/* ------------- SERVICES ROUTES ------------- */
// Récupérer tous les services
router.get('/services', jwtMiddleware, serviceController.getAllServices);
// Créer un service
router.post(
	'/service',
	jwtMiddleware,
	dataValidation(serviceCreationSchema),
	rightsMiddleware('Admin'),
	serviceController.createService
);
// Modifier un service
router.patch(
	'/service/:id',
	jwtMiddleware,
	dataValidation(serviceUpdateSchema),
	rightsMiddleware('Admin'),
	serviceController.updateService
);
// Supprimer un service
router.delete(
	'/service/:id',
	jwtMiddleware,
	rightsMiddleware('Admin'),
	serviceController.deleteService
);

/* ------------- STATS ROUTES ------------- */
// Nombre d'agents et d'appareils par service
router.get(
	'/stats/agents-devices-per-service',
	jwtMiddleware,
	statsController.getAgentsAndDevicesPerService
);
// Nombre d'appareils par modèle
router.get(
	'/stats/devices-per-model',
	jwtMiddleware,
	statsController.getDevicesAmountPerModel
);

/* ------------- HISTORY ROUTES ------------- */
router.get(
	'/history',
	jwtMiddleware,
	rightsMiddleware('Tech'),
	historyController.getAllHistory
);
router.delete(
	'/history',
	jwtMiddleware,
	rightsMiddleware('Admin'),
	historyController.deleteHistory
);

export default router;
