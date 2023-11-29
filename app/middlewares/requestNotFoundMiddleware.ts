import { Request, Response } from 'express';

const requestNotFoundMiddleware = (_: Request, res: Response) => {
	res.status(404).json("La requête fournie n'existe pas");
};

export default requestNotFoundMiddleware;
