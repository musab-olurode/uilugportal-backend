import { NextFunction, Request, Response } from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { IIdTokens } from '../../interfaces/IdTokens';
import { getSessionsAsString } from '../helpers/constants';
import asyncHandler from '../middlewares/async';
import UserService from '../services/user';

// eslint-disable-next-line no-unused-vars
export const getResult = asyncHandler(
	// eslint-disable-next-line no-unused-vars
	async (req: Request, res: Response, next: NextFunction) => {
		const sessionsAsString = getSessionsAsString();
		await req.validate({
			session: 'required|string|in:' + sessionsAsString,
		});

		const results = await UserService.getResults(
			req.sessionId as string,
			req.query.session as string
		);

		return new SuccessResponse('results retrieved successfully', {
			results,
		}).send(res);
	}
);

export const calculateCGPA = asyncHandler(
	// eslint-disable-next-line no-unused-vars
	async (req: Request, res: Response, next: NextFunction) => {
		await req.validate({
			level: 'required|string|in:100,200,300,400,500',
		});

		const cgpa = await UserService.calculateCGPA(
			req.sessionId as string,
			req.query.level as string
		);

		return new SuccessResponse('CGPA calculated successfully', { cgpa }).send(
			res
		);
	}
);

export const getAllPrintables = asyncHandler(
	// eslint-disable-next-line no-unused-vars
	async (req: Request, res: Response, next: NextFunction) => {
		const sessionsAsString = getSessionsAsString();
		await req.validate({
			session: 'required|string|in:' + sessionsAsString,
			currentLevel: 'required|string|in:100,200,300,400,500',
			levelForCourseForm: 'required|string|in:100,200,300,400,500',
			matricNumber: 'required|string',
		});

		const { session, currentLevel, levelForCourseForm, matricNumber } =
			req.query;

		const printables = await UserService.getPrintables(
			req.sessionId as string,
			session as string,
			req.idTokens as IIdTokens,
			Number(currentLevel),
			Number(levelForCourseForm),
			matricNumber as string
		);

		return new SuccessResponse('printables retrieved successfully', {
			printables,
		}).send(res);
	}
);
