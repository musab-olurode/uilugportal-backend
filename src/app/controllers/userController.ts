import { NextFunction, Request, Response } from 'express';
import { IIdTokens } from '../../interfaces/IdTokens';
import { IResult } from '../../interfaces/Result';
import { getSessionsAsString, gradePoints } from '../helpers/constants';
import { errorResponse, successResponse } from '../helpers/response';
import asyncHandler from '../middlewares/async';
import { getPrintables, getResults } from '../services/httpHandler';

// eslint-disable-next-line no-unused-vars
export const getResult = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const sessionsAsString = getSessionsAsString();
	await req.validate({
		session: 'required|string|in:' + sessionsAsString,
	});

	const { session } = req.query;
	const response = await getResults(req.sessionId as string, {
		session,
	});

	if (!response.success) {
		return errorResponse(next, response.message, response.code);
	}

	successResponse(res, 'data retrieved', { result: response.result });
});

export const calculateCGPA = asyncHandler(
	// eslint-disable-next-line no-unused-vars
	async (req: Request, res: Response, next: NextFunction) => {
		await req.validate({
			level: 'required|string|in:100,200,300,400,500',
		});

		const { level } = req.query;

		let thisYear = new Date().getFullYear();
		let sessions = Number((level as string).charAt(0));

		let results: IResult[] = [];

		let failedToGetAllResults = {
			success: true,
			message: '',
			code: 200,
		};

		for (let i = 1; i <= sessions; i++) {
			let session = `${thisYear - 1}/${thisYear}`;
			const response = await getResults(req.sessionId as string, {
				session,
			});
			if (!response.success) {
				failedToGetAllResults.success = false;
				failedToGetAllResults.code = response.code;
				break;
			}
			results = results.concat(response.result as IResult[]);
			--thisYear;
		}

		if (!failedToGetAllResults.success) {
			return errorResponse(next, failedToGetAllResults.message, failedToGetAllResults.code);
		}

		let qps = 0;
		let units = 0;
		let cgpa = 0;
		results.map((result) => {
			if (result.grade) {
				let qp = gradePoints[result.grade as string] * Number(result.unit);
				qps += qp;
				units += Number(result.unit);
			}
		});
		cgpa = Number((qps / units).toFixed(2));

		successResponse(res, 'data retrieved', { cgpa });
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

		const { session, currentLevel, levelForCourseForm, matricNumber } = req.query;

		const printables = await getPrintables(
			req.sessionId as string,
			{ session },
			req.idTokens as IIdTokens,
			Number(currentLevel),
			Number(levelForCourseForm),
			matricNumber as string
		);

		successResponse(res, 'data retrieved', { printables: printables.data });
	}
);
