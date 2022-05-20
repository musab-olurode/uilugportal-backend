import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { CreatedResponse, SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../middlewares/async';
import PostService from '../services/post';

export const store = asyncHandler(async (req: Request, res: Response) => {
	await req.validate({
		text: 'required|string',
		image: 'array',
		'image.*': 'file|mime:image',
	});

	const { text, image } = req.validated();

	const post = await PostService.createPost(req.user!, text, image);

	return new CreatedResponse('post created successfully', { post }).send(res);
});

export const index = asyncHandler(async (req: Request, res: Response) => {
	return await PostService.getPosts(req, res);
});

export const show = asyncHandler(async (req: Request, res: Response) => {
	const post = await PostService.getPost(
		req.params.postId as unknown as Types.ObjectId
	);

	return new SuccessResponse('post retrieved successfully', { post }).send(res);
});

export const comment = asyncHandler(async (req: Request, res: Response) => {
	await req.validate({
		text: 'required|string',
	});

	const { text } = req.validated();

	const comment = await PostService.commentOnPost(
		req.user!._id,
		req.params.postId as unknown as Types.ObjectId,
		text
	);

	return new SuccessResponse('comment created successfully', { comment }).send(
		res
	);
});

export const getComments = asyncHandler(async (req: Request, res: Response) => {
	return await PostService.getPostComments(
		req,
		res,
		req.params.postId as unknown as Types.ObjectId
	);
});

export const like = asyncHandler(async (req: Request, res: Response) => {
	const post = await PostService.likePost(
		req.user!._id,
		req.params.postId as unknown as Types.ObjectId
	);

	return new SuccessResponse('post liked/unliked successfully', { post }).send(
		res
	);
});

export const destroy = asyncHandler(async (req: Request, res: Response) => {
	await PostService.deletePost(
		req.user!._id,
		req.params.postId as unknown as Types.ObjectId
	);

	return new SuccessResponse('post deleted successfully', {}).send(res);
});
