import createDebug from 'debug';
import { NextFunction, Response, Request } from 'express';
import { User } from '../entities/user';
import { HTTPError } from '../errors/errors';
import { UserRepo } from '../repository/repo.interface';

const debug = createDebug('challenge:Controller-users');

export class UsersController {
  constructor(public repo: UserRepo<User>) {
    debug('Controller instantiating!');
  }

  async getAllUsers(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('Get all function!', this.repo);
      const userData = await this.repo.query();
      resp.json({
        results: userData,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('get');
      const data = await this.repo.queryId(req.params.id);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }
  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('post! (register)');
      if (!req.body.email || !req.body.passwd) {
        throw new HTTPError(403, 'Unauthorized', 'Invalid email or password');
      }
      const data = await this.repo.create(req.body);
      console.log(data);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login-post');
      if (!req.body.email || req.body.passwd)
        throw new HTTPError(403, 'Unauthorized', 'Invalid email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(403, 'Unauthorized', 'Email not found');
      resp.json({
        results: {
          data,
        },
      });
    } catch (error) {
      next(error);
    } // Agregar Auth cuando esté listo
  }
}
