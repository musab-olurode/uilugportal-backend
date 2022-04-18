/* eslint-disable no-useless-escape */
import asyncHandler from '../middlewares/async';
import { NextFunction, Request, Response } from 'express';
import Jwt from '../../core/Jwt';
import { IIdTokens } from '../../interfaces/IdTokens';
import { IUserProfile } from '../../interfaces/UserProfile';
import { jwtCookieExpire } from '../../configs';
import AuthService from '../services/auth';
import { SuccessResponse } from '../../core/ApiResponse';

export const signin = asyncHandler(
	// eslint-disable-next-line no-unused-vars
	async (req: Request, res: Response, next: NextFunction) => {
		await req.validate({
			matricNumber: 'required|string',
			password: 'required|string',
		});

		const { matricNumber, password } = req.validated();

		const { sessionId, idTokens, user } = await AuthService.signin(
			matricNumber,
			password
		);

		return sendTokenResponse(
			res,
			sessionId,
			idTokens,
			user,
			200,
			'signed in successfully'
		);
	}
);

// eslint-disable-next-line no-unused-vars
export const signout = asyncHandler(async (req: Request, res: Response) => {
	await AuthService.signout(req.sessionId as string);

	new SuccessResponse('signed out successfully', {});
});

// eslint-disable-next-line no-unused-vars
export const getLoggedInUser = asyncHandler(
	// eslint-disable-next-line no-unused-vars
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await AuthService.getLoggedInUser(
			req.sessionId as string,
			req.idTokens as IIdTokens
		);

		return new SuccessResponse('data retrieved', { user }).send(res);
	}
);

// Create token, add cookie and send response
const sendTokenResponse = (
	res: Response,
	sessionId: string,
	idTokens: IIdTokens,
	user: IUserProfile,
	statusCode: number = 200,
	message?: string
) => {
	const token = Jwt.issue(sessionId, idTokens);

	const options = {
		expires: new Date(
			Date.now() + (jwtCookieExpire as unknown as number) * 60 * 1000
		),
		httpOnly: true,
		secure: false,
	};

	res
		.status(statusCode)
		.cookie('token', token, options)
		.cookie('PHPSESSID', sessionId, options)
		.json({
			success: true,
			message,
			data: { user, token },
		});
};
