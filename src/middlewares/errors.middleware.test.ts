import { NextFunction, Request, Response } from 'express';
import { errorsMiddleware } from './errors.middleware';
import { Error as MongooseError } from 'mongoose';
import { HTTPError } from '../errors/errors';

describe('Given errorMiddleware', () => {
  const req = {} as unknown as Request;
  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();
  describe('When error is a castError', () => {
    test('Then status should be 400', () => {
      // Arrange
      const error = new MongooseError.CastError(' ', ' ', ' ');
      // Act
      errorsMiddleware(error, req, resp, next);
      // Assert
      expect(resp.status).toHaveBeenCalledWith(400);
    });
  });
  describe('When error is a validationError', () => {
    test('Then it should', () => {
      // Arrange
      const error = new MongooseError.ValidationError();
      // Act
      errorsMiddleware(error, req, resp, next);
      // Assert
      expect(resp.status).toHaveBeenCalledWith(406);
    });
  });
  describe('When error is a custom HTTPError', () => {
    test('Then it should', () => {
      // Arrange
      const error = new HTTPError(418, 'tetera', 'tetera');
      // Act
      errorsMiddleware(error, req, resp, next);
      // Assert
      expect(resp.status).toHaveBeenCalledWith(418);
    });
  });
  describe('When error is any other kind of error', () => {
    test('Then it should', () => {
      // Arrange
      const error = new Error();
      // Act
      errorsMiddleware(error, req, resp, next);
      // Assert
      expect(resp.status).toHaveBeenCalledWith(500);
    });
  });
});
