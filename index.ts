import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './app/router';
import cors from 'cors';
import requestNotFoundMiddleware from './app/middlewares/requestNotFoundMiddleware';

const app = express();

const port = process.env.PORT || 3000;
const clientUrl = process.env.CLIENT_URL;

const corsOptions = {
	origin: clientUrl,
	credentials: true, // Authorize credentials
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(router);

app.use(requestNotFoundMiddleware);

app.listen(port, () => {
	console.log(`Listening on <http://localhost>:${port}`);
});
