import { Router } from 'express';
import jwtMiddleware from './middlewares/jwtMidleware.ts';
import requestsLimitMiddleware from './middlewares/requestsLimitMiddleware.ts';
import userController from './controllers/userController.ts';
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
// Route used to create the first user
// router.post('/register', userController.register);
export default router;
