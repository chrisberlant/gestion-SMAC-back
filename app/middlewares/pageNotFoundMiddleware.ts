import { Request, Response } from 'express';

const middleware404 = (req: Request, res: Response) => {
	res.status(404).send('404');
};

export default middleware404;
