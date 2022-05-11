import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../middlewares/async';
import AssignmentService from '../services/assignment';

export const index = asyncHandler(async (req: Request, res: Response) => {
	return await AssignmentService.getAssignments(res);
});

export const show = asyncHandler(async (req: Request, res: Response) => {
	const assignment = await AssignmentService.getAssignment(
		req.params.assignmentId as unknown as Types.ObjectId
	);

	return new SuccessResponse('assignment retrieved successfully', {
		assignment,
	}).send(res);
});

export const store = asyncHandler(async (req: Request, res: Response) => {
	await req.validate({
		courseCode: 'required|string',
		courseTitle: 'required|string',
		topic: 'required|string',
		file: 'required|file',
	});

	const assignmentData = req.validated();

	const assignment = await AssignmentService.createAssignment(
		req.user!._id,
		assignmentData
	);

	return new SuccessResponse('assignment updated successfully', {
		assignment,
	}).send(res);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
	await req.validate({
		courseCode: 'required|string',
		courseTitle: 'required|string',
		topic: 'required|string',
		file: 'file',
	});

	const assignmentData = req.validated();

	const assignment = await AssignmentService.updateAssignment(
		req.user!._id,
		req.params.assignmentId as unknown as Types.ObjectId,
		assignmentData
	);

	return new SuccessResponse('assignment updated successfully', {
		assignment,
	}).send(res);
});

export const getUserAssignments = asyncHandler(
	async (req: Request, res: Response) => {
		const assignments = await AssignmentService.getUserAssignments(
			req.user!._id
		);

		return new SuccessResponse('assignments retrieved successfully', {
			assignments,
		}).send(res);
	}
);

export const destroy = asyncHandler(async (req: Request, res: Response) => {
	await AssignmentService.deleteAssignment(
		req.user!._id,
		req.params.assignmentId as unknown as Types.ObjectId
	);

	return new SuccessResponse('assignment deleted successfully', {}).send(res);
});
