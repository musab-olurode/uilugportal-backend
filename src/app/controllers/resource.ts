import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../middlewares/async';
import ResourceService from '../services/resource';

export const index = asyncHandler(async (req: Request, res: Response) => {
	return await ResourceService.getResources(res);
});

export const show = asyncHandler(async (req: Request, res: Response) => {
	const resource = await ResourceService.getResource(
		req.params.resourceId as unknown as Types.ObjectId
	);

	return new SuccessResponse('resource retrieved successfully', {
		resource,
	}).send(res);
});

export const store = asyncHandler(async (req: Request, res: Response) => {
	await req.validate({
		courseCode: 'required|string',
		courseTitle: 'required|string',
		topic: 'required|string',
		file: 'required|file',
	});

	const { file, ...resourceData } = req.validated();

	const resource = await ResourceService.createResource(
		req.user!._id,
		resourceData,
		file
	);

	return new SuccessResponse('resource updated successfully', {
		resource,
	}).send(res);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
	await req.validate({
		courseCode: 'required|string',
		courseTitle: 'required|string',
		topic: 'required|string',
		file: 'file',
	});

	const { file, ...resourceData } = req.validated();

	const resource = await ResourceService.updateResource(
		req.user!._id,
		req.params.resourceId as unknown as Types.ObjectId,
		resourceData,
		file
	);

	return new SuccessResponse('resource updated successfully', {
		resource,
	}).send(res);
});

export const getUserResources = asyncHandler(
	async (req: Request, res: Response) => {
		const resources = await ResourceService.getUserResources(req.user!._id);

		return new SuccessResponse('resources retrieved successfully', {
			resources,
		}).send(res);
	}
);

export const destroy = asyncHandler(async (req: Request, res: Response) => {
	await ResourceService.deleteResource(
		req.user!._id,
		req.params.resourceId as unknown as Types.ObjectId
	);

	return new SuccessResponse('resource deleted successfully', {}).send(res);
});

export const search = asyncHandler(async (req: Request, res: Response) => {
	await req.validate(
		{
			s: 'required|string|min:3',
		},
		['query'],
		{
			'required.s': 'The search query is required',
			'string.s': 'The search query must be a string',
			'min.s': 'The search query must be at least 3 characters long',
		}
	);

	return await await ResourceService.searchResources(req, res);
});
