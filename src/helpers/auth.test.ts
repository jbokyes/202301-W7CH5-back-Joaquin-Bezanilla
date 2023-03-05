import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Auth, PayloadToken } from './auth.js';

jest.mock('bcryptjs');
jest.mock('../config', () => {
  __dirname: 'testdir';
  config: {
    jwtSecret: 'a';
  }
});
jest.mock('jsonwebtoken');

describe('Given the auth class', () => {
  describe('When we call the createToken method', () => {
    test('Then it should call the jwt.sign method', async () => {
      const testpayload = {
        id: '2',
        email: 'test',
        role: 'admin',
      };
      Auth.createJWT(testpayload);
      expect(jwt.sign).toHaveBeenCalled();
    });
  });
  describe('When we call for the token payload', () => {
    describe('When a secret is not provided', () => {
      test('Then it should throw an httperror', () => {
        expect(() => Auth.getTokenPayload('a')).toThrow();
      });
    });
  });
});
