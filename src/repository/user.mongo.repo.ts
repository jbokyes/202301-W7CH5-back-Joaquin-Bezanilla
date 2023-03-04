import createDebug from 'debug';
import { UserModel } from './user.mongo.model';
import { User } from '../entities/user';
import { UserRepo } from './repo.interface';
import { HTTPError } from '../errors/errors';
const debug = createDebug('W7-CH5:user-mongo-repo');

export class UsersMongoRepo implements UserRepo<User> {
  public constructor() {
    debug('User Mongo Repo instantiating!');
  }

  async query(): Promise<User[]> {
    debug('User query! (All)');
    const data = await UserModel.find().populate(['friends', 'enemies']);
    return data;
  }

  async queryId(id: string): Promise<User> {
    debug('queryId: ' + id);
    const data = await UserModel.findById(id);
    if (!data)
      throw new HTTPError(
        404,
        'Id not found',
        'Id not found while doing queryId'
      );
    return data;
  }
}
