import { NextFunction } from 'express';
import { UsersMongoRepo } from '../repository/user.mongo.repo';
import { UsersController } from './users.controller';

describe('Given UsersController', () => {
  const repo: UsersMongoRepo = {
    query: jest.fn(),
    queryId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(),
  };

  const req = {
    body: { email: 'a', passwd: 'a' },
  } as unknown as Request;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn() as NextFunction;

  const controller = new UsersController(repo);

  describe('register', () => {
    test('Then it should create (post) a new object', async () => {
      await controller.register(req, resp, next);
    });
  });
});
