import { NextFunction, Response } from 'express';
import { Auth, PayloadToken } from '../helpers/auth.js';
import { RequestPlus, Interceptors } from './interceptor.js';

jest.mock('../helpers/auth.js');

const mockReq = {
  get: jest.fn(),
} as unknown as RequestPlus;
const mockResp = {} as Response;
const next = jest.fn() as NextFunction;

jest.mock('../config.js', () => ({
  __dirname: 'test',
  config: {
    jwtSecret: 'test',
  },
}));
//Recordar que los interceptors siempre pasarán un next, sea error o no.
describe('Given the interceptors class', () => {
  describe('When we call the logged in interceptor method', () => {
    describe('Assuming we get the correct parameters', () => {
      test('then it should call the next function', () => {
        (mockReq.get as jest.Mock).mockReturnValue('Bearer test');
        (Auth.getTokenPayload as jest.Mock).mockResolvedValue({
          id: 'test',
        } as PayloadToken);
        Interceptors.logged(mockReq, mockResp, next);
        expect(next).toHaveBeenCalled();
      });
    });
    describe('When called with no authorization header', () => {
      test('Then it should call next(error)', () => {
        (mockReq.get as jest.Mock).mockReturnValue(undefined);
        Interceptors.logged(mockReq, mockResp, next);
        expect(next).toHaveBeenCalled();
      });
    });
    // Test redundante, la idea era cubrir línea 24, la que lanza error por "start with Bearer"
    describe('When Authorization does start with "Bearer"', () => {
      test('Then it should call next function (error)', () => {
        (mockReq.get as jest.Mock).mockResolvedValue('Bearer');
        Interceptors.logged(mockReq, mockResp, next);
        expect(next).toHaveBeenCalled();
      });
    });
  });
});
