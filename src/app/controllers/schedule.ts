import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../middlewares/async';
import ScheduleService from '../services/schedule';

export const index = asyncHandler(async (req: Request, res: Response) => {
	return await ScheduleService.getSchedules(res);
});

export const show = asyncHandler(async (req: Request, res: Response) => {
	const schedule = await ScheduleService.getSchedule(
		req.params.scheduleId as unknown as Types.ObjectId
	);

	return new SuccessResponse('schedule retrieved successfully', {
		schedule,
	}).send(res);
});

export const store = asyncHandler(async (req: Request, res: Response) => {
	await req.validate(
		{
			courseCode: 'required|string',
			courseTitle: 'required|string',
			venue: 'required|string',
			weekdays: 'array',
			'weekdays.*': 'required|string|in:Mon,Tue,Wed,Thu,Fri,Sat,Sun',
			startTime: 'required|date',
			endTime: 'required|date',
			note: 'string',
		},
		['body'],
		{
			'required.weekdays.*': 'a weekday is required',
			'string.weekdays.*': 'a weekday must be a string',
			'in.weekdays.*': 'weekdays must be one of Mon,Tue,Wed,Thu,Fri,Sat,Sun',
		}
	);

	const scheduleData = req.validated();

	const schedule = await ScheduleService.createSchedule(
		req.user!._id,
		scheduleData
	);

	return new SuccessResponse('schedule created successfully', {
		schedule,
	}).send(res);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
	await req.validate({
		courseCode: 'required|string',
		courseTitle: 'required|string',
		venue: 'required|string',
		weekdays: 'required|array',
		'weekdays.*': 'required|string|in:Mon,Tue,Wed,Thu,Fri,Sat,Sun',
		startTime: 'required|date',
		endTime: 'required|date',
		note: 'string',
	});

	const scheduleData = req.validated();

	const schedule = await ScheduleService.updateSchedule(
		req.user!._id,
		req.params.scheduleId as unknown as Types.ObjectId,
		scheduleData
	);

	return new SuccessResponse('schedule updated successfully', {
		schedule,
	}).send(res);
});

export const getUserSchedules = asyncHandler(
	async (req: Request, res: Response) => {
		const schedules = await ScheduleService.getUserSchedules(req.user!._id);

		return new SuccessResponse('schedules retrieved successfully', {
			schedules,
		}).send(res);
	}
);

export const destroy = asyncHandler(async (req: Request, res: Response) => {
	await ScheduleService.deleteSchedule(
		req.user!._id,
		req.params.scheduleId as unknown as Types.ObjectId
	);

	return new SuccessResponse('schedule deleted successfully', {}).send(res);
});
