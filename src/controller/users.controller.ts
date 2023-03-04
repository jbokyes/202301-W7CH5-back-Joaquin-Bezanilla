import createDebug from 'debug';
import { NextFunction, Response, Request } from 'express';
import { User } from '../entities/user';
import { UserRepo } from '../repository/repo.interface';

const debug = createDebug('W7-CH5:Controller-users');

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
}
