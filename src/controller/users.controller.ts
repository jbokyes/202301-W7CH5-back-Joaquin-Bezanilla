import createDebug from 'debug';
import { NextFunction, Response, Request } from 'express';
import { User } from '../entities/user';
import { HTTPError } from '../errors/errors.js';
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
      debug('get specific id');
      const data = await this.repo.queryId(req.params.id);
      console.log(req.params);
      resp.json({
        results: data,
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
      const { email, passwd } = req.body;
      if (!email || !passwd)
        throw new HTTPError(403, 'Unauthorized', 'Invalid email or password');
      const data = await this.repo.search({
        key: 'email',
        value: email,
      });
      if (!data.length)
        throw new HTTPError(403, 'Unauthorized', 'Email not found');
      resp.json({
        results: {
          data,
        },
      });
      debug('Login done by: ' + email);
    } catch (error) {
      next(error);
    } // Agregar Auth cuando esté listo
  }

  async addFriend(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('addFriend!');
      if (!req.body.id) {
        throw new HTTPError(
          404,
          'Enter a valid ID',
          'Undefined ID, check process'
        );
      }
      //Buscar id de persona que quiero agregar (yo)
      const addingUserId = await this.repo.queryId(req.params.id);
      // Buscar persona que quiero agregar (él)
      const addedUserId = await this.repo.queryId(req.body.id);
      //Ward
      if (!addingUserId.friends)
        throw new HTTPError(
          404,
          'User not found',
          'User adding friendlist not found'
        );
      if (!addedUserId.friends)
        throw new HTTPError(
          404,
          'User not found',
          'User being added friendlist being added id not found'
        );
      //Al agregarse, cada uno aparece en la friendlist del otro
      addingUserId.friends.push(addedUserId);
      addedUserId.friends.push(addingUserId);
      const updatedUser = await this.repo.update(addingUserId);
      await this.repo.update(addedUserId);
      debug('Friendship confirmed');

      resp.json({
        results: [updatedUser],
      });
    } catch (error) {
      next(error);
    }
  }
}
