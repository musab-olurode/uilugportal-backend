import { Request, Response } from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { getSessionsAsString } from '../helpers/constants';
import asyncHandler from '../middlewares/async';
import UserService from '../services/user';

export const getResult = asyncHandler(async (req: Request, res: Response) => {
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
});

export const calculateCGPA = asyncHandler(
	async (req: Request, res: Response) => {
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
	async (req: Request, res: Response) => {
		const sessionsAsString = getSessionsAsString();
		await req.validate({
			session: 'required|string|in:' + sessionsAsString,
			currentLevel: 'required|string|in:100,200,300,400,500',
			levelForCourseForm: 'required|string|in:100,200,300,400,500',
			matricNumber: 'required|string',
		});

		const { session, currentLevel, levelForCourseForm, matricNumber } =
			req.query;

		const idTokens = {
			r_val: req.user!.idTokens.rVal,
			id: req.user!.idTokens.id,
			p_id: req.user!.idTokens.pId,
		};

		const printables = await UserService.getPrintables(
			req.sessionId as string,
			session as string,
			idTokens,
			Number(currentLevel),
			Number(levelForCourseForm),
			matricNumber as string
		);

		return new SuccessResponse('printables retrieved successfully', {
			printables,
		}).send(res);
	}
);
