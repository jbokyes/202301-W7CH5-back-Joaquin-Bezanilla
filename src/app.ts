import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import { CustomError } from './errors/errors.js';
import { userRouter } from './router/user.router.js';
import { errorsMiddleware } from './middlewares/errors.middleware.js';

const debug = createDebug('challenge:app');

export const app = express();

app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};

app.use(morgan('dev')); // Pendiente a averiguar que hace morgan exactamente
app.use(express.json()); // ?? Que hace este express exactamente?
app.use(cors(corsOptions));
app.use('/users', userRouter);

app.get('/', (_req, resp) => {
  resp.json({
    info: "The most complex social network you'll ever encounter",
    current_endpoints: {
      users: '/users',
    },
  });
});
// Middleware de errores
app.use(errorsMiddleware);

app.use(express.static('public'));
