/* eslint-disable no-useless-escape */
import asyncHandler from '../middlewares/async';
import { Request, Response } from 'express';
import Jwt from '../../core/Jwt';
import { IIdTokens } from '../../interfaces/IdTokens';
import { jwtCookieExpire } from '../../configs';
import AuthService from '../services/auth';
import { SuccessResponse } from '../../core/ApiResponse';

export const signin = asyncHandler(async (req: Request, res: Response) => {
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
});

export const signout = asyncHandler(async (req: Request, res: Response) => {
	await AuthService.signout(req.sessionId as string);

	return new SuccessResponse('signed out successfully', {}).send(res);
});

// eslint-disable-next-line no-unused-vars
export const getLoggedInUser = asyncHandler(
	async (req: Request, res: Response) => {
		const user = await AuthService.getLoggedInUser(
			req.sessionId as string,
			req.idTokens as IIdTokens,
			req.user!._id
		);

		return new SuccessResponse('data retrieved', { user }).send(res);
	}
);

// Create token, add cookie and send response
const sendTokenResponse = (
	res: Response,
	sessionId: string,
	idTokens: IIdTokens,
	user: any,
	statusCode: number = 200,
	message?: string
) => {
	const token = Jwt.issue(sessionId, idTokens, user.user._id);

	const options = {
		expires: new Date(
			Date.now() + (jwtCookieExpire as unknown as number) * 60 * 1000
		),
		httpOnly: true,
		secure: false,
	};

	return res
		.status(statusCode)
		.cookie('token', token, options)
		.cookie('PHPSESSID', sessionId, options)
		.json({
			success: true,
			message,
			data: { user, token },
		});
};
