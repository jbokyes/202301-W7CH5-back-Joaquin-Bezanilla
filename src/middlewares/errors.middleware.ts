import { Error } from 'mongoose';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { CustomError, HTTPError } from '../errors/errors';
const debug = createDebug('challenge:app:errors middleware!');

export const errorsMiddleware = (
  error: CustomError | Error,
  _req: Request,
  resp: Response,
  _next: NextFunction
) => {
  debug(
    'Soy el middleware de errores! Verifica el código o lo que ingresaste!'
  );
  let status = 500;
  let statusMessage = 'Interal server error, nuestro favorito';
  if (error instanceof HTTPError) {
    status = error.statusCode;
    statusMessage = error.statusMessage;
  }
  if (error instanceof Error.CastError) {
    status = 400;
    statusMessage = 'Wrongly formatted';
  }
  if (error instanceof Error.ValidationError) {
    status = 406;
    statusMessage = 'Validation error in the request';
  }

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
};
