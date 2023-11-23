import { Request, Response } from 'express';

const middleware404 = (_: Request, res: Response) => {
	res.status(404).json('Page non trouvée: 404');
};

export default middleware404;
