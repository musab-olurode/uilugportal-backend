/* eslint-disable no-useless-escape */
import asyncHandler from '../middlewares/async';
import { Request, Response } from 'express';
import Jwt from '../../core/Jwt';
import { jwtCookieExpire } from '../../configs';
import AuthService from '../services/auth';
import { SuccessResponse } from '../../core/ApiResponse';
import { UserDoc } from '../../interfaces/UserDoc';

export const signin = asyncHandler(async (req: Request, res: Response) => {
	await req.validate({
		matricNumber: 'required|string',
		password: 'required|string',
	});

	const { matricNumber, password } = req.validated();

	const { sessionId, user } = await AuthService.signin(matricNumber, password);

	return sendTokenResponse(res, sessionId, user, 200, 'signed in successfully');
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
			req.user!
		);

		if (req.user!.faculty !== user.faculty) {
			req.user!.faculty = user.faculty;
		}
		if (req.user!.department !== user.department) {
			req.user!.department = user.department;
		}
		if (
			req.user!.level !== user.level &&
			parseInt(user.level) > parseInt(req.user!.level)
		) {
			req.user!.level = user.level;
		}

		if (req.user!.isModified()) {
			await req.user!.save();
		}

		return new SuccessResponse('data retrieved', { user }).send(res);
	}
);

// Create token, add cookie and send response
const sendTokenResponse = (
	res: Response,
	sessionId: string,
	user: UserDoc,
	statusCode: number = 200,
	message?: string
) => {
	const token = Jwt.issue(sessionId, user._id);

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
