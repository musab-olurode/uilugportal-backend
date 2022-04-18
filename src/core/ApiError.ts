import { Response } from 'express';
import { environment } from '../configs';
import {
	AuthFailureResponse,
	BadRequestDataResponse,
	BadRequestResponse,
	ForbiddenResponse,
	InternalErrorResponse,
	NotFoundResponse,
} from './ApiResponse';

enum ErrorType {
	BAD_TOKEN = 'BadTokenError',
	UNAUTHORIZED = 'AuthFailureError',
	INTERNAL = 'InternalError',
	NOT_FOUND = 'NotFoundError',
	NO_ENTRY = 'NoEntryError',
	NO_DATA = 'NoDataError',
	BAD_REQUEST = 'BadRequestError',
	BAD_REQUEST_DATA = 'BadRequestDataError',
	FORBIDDEN = 'ForbiddenError',
}

export abstract class ApiError extends Error {
	// eslint-disable-next-line
	constructor(
		public type: ErrorType,
		public message: string = 'error',
		protected data?: any
	) {
		super(type);
	}

	public static handle(err: ApiError, res: Response): Response {
		switch (err.type) {
			case ErrorType.BAD_TOKEN:
			case ErrorType.UNAUTHORIZED:
				return new AuthFailureResponse(err.message).send(res);
			case ErrorType.INTERNAL:
				return new InternalErrorResponse(err.message).send(res);
			case ErrorType.NOT_FOUND:
			case ErrorType.NO_ENTRY:
			case ErrorType.NO_DATA:
				return new NotFoundResponse(err.message).send(res);
			case ErrorType.BAD_REQUEST:
				return new BadRequestResponse(err.message).send(res);
			case ErrorType.BAD_REQUEST_DATA:
				return new BadRequestDataResponse(err.message, err.data).send(res);
			case ErrorType.FORBIDDEN:
				return new ForbiddenResponse(err.message).send(res);
			default: {
				let message = err.message;
				if (environment === 'production') message = 'Something went wrong.';
				return new InternalErrorResponse(message).send(res);
			}
		}
	}
}

export class AuthFailureError extends ApiError {
	constructor(message = 'Invalid Credentials') {
		super(ErrorType.UNAUTHORIZED, message);
	}
}

export class InternalError extends ApiError {
	constructor(message = 'Internal Error') {
		super(ErrorType.INTERNAL, message);
	}
}

export class BadRequestError extends ApiError {
	constructor(message = 'Bad Request') {
		super(ErrorType.BAD_REQUEST, message);
	}
}

export class BadRequestDataError extends ApiError {
	// eslint-disable-next-line
	constructor(message = 'Bad Request', protected data: any) {
		super(ErrorType.BAD_REQUEST_DATA, message, data);
	}
}

export class NotFoundError extends ApiError {
	constructor(message = 'Not Found') {
		super(ErrorType.NOT_FOUND, message);
	}
}

export class ForbiddenError extends ApiError {
	constructor(message = 'Permission Denied') {
		super(ErrorType.FORBIDDEN, message);
	}
}

export class NoEntryError extends ApiError {
	constructor(message = "Entry don't exists") {
		super(ErrorType.NO_ENTRY, message);
	}
}

export class BadTokenError extends ApiError {
	constructor(message = 'Token is not valid') {
		super(ErrorType.BAD_TOKEN, message);
	}
}

export class NoDataError extends ApiError {
	constructor(message = 'No data available') {
		super(ErrorType.NO_DATA, message);
	}
}
