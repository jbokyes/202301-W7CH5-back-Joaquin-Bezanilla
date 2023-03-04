import createDebug from 'debug';
import { UserModel } from './user.mongo.model.js';
import { User } from '../entities/user.js';
import { UserRepo } from './repo.interface';
import { HTTPError } from '../errors/errors.js';
const debug = createDebug('W7-CH5:user-mongo-repo');

export class UsersMongoRepo implements UserRepo<User> {
  public constructor() {
    debug('User Mongo Repo instantiating!');
  }

  async query(): Promise<User[]> {
    const data = await UserModel.find()
      .populate('friends', { friends: 0, enemies: 0 }, 'enemies', {
        friends: 0,
        enemies: 0,
      })
      .exec();
    debug('User query! (All)');
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

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    debug('search');
    const data = UserModel.find({ [query.key]: query.value });
    return data;
  }

  async create(info: Partial<User>): Promise<User> {
    debug('create' + info.email);
    const data = await UserModel.create(info);
    return data;
  }

  async update(info: Partial<User>): Promise<User> {
    debug('update ' + info.name);
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });
    if (!data)
      throw new HTTPError(
        404,
        'Email not found!',
        'Email not found in update!'
      );
    return data;
  }

  async delete(id: string): Promise<void> {
    debug('delete: ' + id);
    const data = await UserModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(
        404,
        'Delete not possible',
        'Id not found for annihilation of account'
      );
  }
}
