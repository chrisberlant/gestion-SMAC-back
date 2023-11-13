import { Router } from 'express';
import jwtMiddleware from './middlewares/jwtMidleware.ts';
import requestsLimitMiddleware from './middlewares/requestsLimitMiddleware.ts';
import userController from './controllers/userController.ts';
import lineController from './controllers/lineController.ts';
import dataValidation from './middlewares/dataValidationMiddleware.ts';
import { selectionSchema, userLoginSchema } from './validationSchemas.ts';

const router = Router();

/* ------------- USER/AUTH ROUTES ------------- */
router.post(
	'/login',
	requestsLimitMiddleware,
	dataValidation(userLoginSchema),
	userController.login
);
router.get('/getUserInfos', jwtMiddleware, userController.getUserInfos);
router.patch('/modifyUserInfos', jwtMiddleware, userController.modifyUserInfos);
router.patch(
	'/modifyUserPassword',
	jwtMiddleware,
	userController.modifyUserPassword
);
// Route used to create the first user
// router.post('/register', userController.register);

/* ------------- LINES ROUTES ------------- */
router.get('/getAllLines/:status', jwtMiddleware, lineController.getAllLines);

export default router;
