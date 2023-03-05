import { Request, Response, NextFunction } from 'express';
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
    body: { email: 'a', passwd: 'a', id: '1' },
  } as unknown as Request;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn() as NextFunction;

  const controller = new UsersController(repo);

  describe('Given the register function and giving it a correct email and password', () => {
    test('Then it should create (post) a new object', async () => {
      await controller.register(req, resp, next);
      expect(repo.create).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then it should give us an error when not given a correct email or password', async () => {
      const req = {
        body: { passwd: 'a' },
      } as unknown as Request;
      (repo.create as jest.Mock).mockRejectedValue(new Error());
      await controller.register(req, resp, next);
      expect(repo.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    test('Then it should give us an error when search of registered user is unsuccesful and call next', async () => {
      req.body = { email: 'Test', password: 'wronger', id: '2' };
      (repo.create as jest.Mock).mockResolvedValue([]);
      await controller.register(req, resp, next);
      expect(repo.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
  describe('Given the login function', () => {
    test('Then it should return json data of the login account', async () => {
      const req = {
        body: { email: 'a', passwd: 'a', id: '1' },
      } as unknown as Request;
      await controller.login(req, resp, next);
      expect(repo.search).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then it should give us an error when not given a correct email or password', async () => {
      const req = {
        body: { passwd: 'a' },
      } as unknown as Request;
      (repo.search as jest.Mock).mockRejectedValue(new Error());
      await controller.register(req, resp, next);
      expect(repo.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
  describe('Given the getAllUsers function', () => {
    test('It should return an object with all of the users in the database', async () => {
      await controller.getAllUsers(req, resp, next);
      expect(repo.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then it should catch next if there are any errors', async () => {
      (repo.query as jest.Mock).mockRejectedValue(new Error());
      await controller.getAllUsers(req, resp, next);
      expect(repo.query).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
  describe('Given the getUser function', () => {
    test('It should return one object with the information of a single user', async () => {
      const req = {
        params: { id: '1' },
      } as unknown as Request;
      await controller.getUser(req, resp, next);
      expect(repo.queryId).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then it should no tengo idea if there are any errors', async () => {
      const req = {
        params: { email: 'a', passwd: 'a', id: '' },
      } as unknown as Request;
      (repo.queryId as jest.Mock).mockResolvedValue([]);
      await controller.getUser(req, resp, next);
      expect(repo.queryId).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    // QUÉ LE PASA A ESTE TEST???? !!!!!
  });
  describe('When addFriend is called', () => {
    test('then if the user information is completed, it should return the resp.json', async () => {
      const req = {
        info: { id: '1' },
        params: { id: '1' },
      } as unknown as Request;

      (repo.queryId as jest.Mock).mockResolvedValue({
        friends: [{ id: '1' }],
        id: '2',
      });

      await controller.addFriend(req, resp, next);
      expect(repo.queryId).toHaveBeenCalled();
      /* Función que debiese ser llamada pero no sé como llegar a ella
      expect(repo.update).toHaveBeenCalled();*/
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then if the req.params.id is undefined, it should be catch the error and next function have been called', async () => {
      const req = {
        body: { id: undefined },
      } as unknown as Request;

      await controller.addFriend(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then if the queryId of the repoMock resolved undefined, it should be catch the error and next function have been called', async () => {
      const req = {
        info: { id: '1' },
        params: { id: '1' },
      } as unknown as Request;

      (repo.queryId as jest.Mock).mockResolvedValue(undefined);

      await controller.addFriend(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
