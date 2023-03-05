import { NextFunction, Request, Response } from 'express';
import { Auth, PayloadToken } from '../helpers/auth.js';
import createDebugger from 'debug';
import { HTTPError } from '../errors/errors.js';

const debug = createDebugger('challenge:Interceptors!');

export interface RequestPlus extends Request {
  user?: PayloadToken;
}

export abstract class Interceptors {
  static logged(req: RequestPlus, res: Response, next: NextFunction) {
    try {
      debug('Trying to login');
      const authHeader = req.get('Authorization');
      if (!authHeader)
        throw new HTTPError(
          402,
          'Token not working',
          'No authorization header'
        );
      if (!authHeader.startsWith('Bearer'))
        throw new HTTPError(
          402,
          'Token not working',
          'No authorization header'
        );
      next();
    } catch (error) {
      next(error);
    }
  }
}
