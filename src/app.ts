import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import { CustomError } from './errors/errors';
const debug = createDebug('W7:app');
export const app = express();
app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev')); // Pendiente a averiguar que hace morgan exactamente
app.use(express.json()); // ?? Que hace este express exactamente?
app.use(cors(corsOptions));
app.use('users');
app.get('/', (_req, resp) => {
  resp.json({
    info: 'Week7-Challenge5, Social Network',
    endpoints: {
      users: '/users',
    },
  });
});

// Middleware de errores
app.use(
  (error: CustomError, _req: Request, resp: Response, _next: NextFunction) => {
    debug(
      'Soy el middleware de errores! Verifica el código o lo que ingresaste!'
    );
    const status = error.statusCode || 500;
    const statusMessage =
      error.statusMessage || 'Interal server error, nuestro favorito';
    resp.status(status);
    resp.json({
      error: [
        {
          status,
          statusMessage,
        },
      ],
    });
    debug(status, statusMessage, error.message);
  }
);
