import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { PipelineStage, Types } from 'mongoose';
import {
	AuthFailureError,
	BadRequestError,
	NotFoundError,
} from '../../core/ApiError';
import { UserDoc } from '../../interfaces/UserDoc';
import { deleteUpload, uploadFile } from '../helpers/upload';
import Comment from '../models/Comment';
import Like from '../models/Like';
import Post from '../models/Post';
import PaginationService from './paginate';
const ObjectId = Types.ObjectId;

const MAX_IMAGES_PER_POST = 5;

class PostService {
	public static async createPost(
		user: UserDoc,
		text: string,
		images?: UploadedFile | UploadedFile[]
	) {
		const imageUrls: string[] = [];

		if (images) {
			if (!Array.isArray(images)) {
				images = [images];
			}

			if (images.length > MAX_IMAGES_PER_POST) {
				throw new BadRequestError(
					`Only a maximum of ${MAX_IMAGES_PER_POST} images are allowed`
				);
			}

			for (let i = 0; i < images.length; i++) {
				const uploadedFile = await uploadFile(images[i], false, 'posts');
				imageUrls.push(uploadedFile.url);
			}
		}

		const post = await Post.create({
			user: user._id,
			text,
			images: imageUrls,
		});

		return post;
	}

	public static async getPosts(req: Request, res: Response) {
		const pipelines: PipelineStage[] = [
			{
				$sort: { createdAt: -1 },
			},
			{
				$lookup: {
					from: 'users',
					localField: 'user',
					foreignField: '_id',
					as: 'user',
				},
			},
			{
				$unwind: '$user',
			},
			{
				$lookup: {
					from: 'comments',
					let: { postId: '$_id' },
					pipeline: [{ $match: { $expr: { $eq: ['$$postId', '$post'] } } }],
					as: 'commentCount',
				},
			},
			{ $addFields: { commentCount: { $size: '$commentCount' } } },
			{
				$lookup: {
					from: 'likes',
					let: { postId: '$_id' },
					pipeline: [{ $match: { $expr: { $eq: ['$$postId', '$post'] } } }],
					as: 'likeCount',
				},
			},
			{ $addFields: { likeCount: { $size: '$likeCount' } } },
			{
				$lookup: {
					from: 'likes',
					let: { postId: '$_id' },
					pipeline: [
						{ $match: { $expr: { $eq: ['$$postId', '$post'] } } },
						{
							$match: {
								$expr: { $eq: [new Types.ObjectId(req.user!.id), '$user'] },
							},
						},
					],
					as: 'isUserLiked',
				},
			},
			{
				$addFields: {
					isUserLiked: {
						$cond: [{ $eq: [{ $size: '$isUserLiked' }, 1] }, true, false],
					},
				},
			},
			{
				$project: {
					_id: 1,
					user: {
						_id: 1,
						fullName: 1,
						avatar: 1,
						faculty: 1,
						department: 1,
						level: 1,
					},
					text: 1,
					images: 1,
					commentCount: 1,
					likeCount: 1,
					isUserLiked: 1,
					createdAt: 1,
				},
			},
		];

		return await PaginationService.paginateAggregate(
			req,
			res,
			Post,
			pipelines,
			'posts retrieved successfully'
		);
	}

	public static async getPost(postId: Types.ObjectId, userId: Types.ObjectId) {
		const aggregationResult = await Post.aggregate([
			{
				$match: {
					_id: new ObjectId(postId),
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'user',
					foreignField: '_id',
					as: 'user',
				},
			},
			{
				$unwind: '$user',
			},
			{
				$lookup: {
					from: 'comments',
					let: { postId: '$_id' },
					pipeline: [{ $match: { $expr: { $eq: ['$$postId', '$post'] } } }],
					as: 'commentCount',
				},
			},
			{ $addFields: { commentCount: { $size: '$commentCount' } } },
			{
				$lookup: {
					from: 'likes',
					let: { postId: '$_id' },
					pipeline: [{ $match: { $expr: { $eq: ['$$postId', '$post'] } } }],
					as: 'likeCount',
				},
			},
			{ $addFields: { likeCount: { $size: '$likeCount' } } },
			{
				$lookup: {
					from: 'likes',
					let: { postId: '$_id' },
					pipeline: [
						{ $match: { $expr: { $eq: ['$$postId', '$post'] } } },
						{
							$match: {
								$expr: { $eq: [new Types.ObjectId(userId), '$user'] },
							},
						},
					],
					as: 'isUserLiked',
				},
			},
			{
				$addFields: {
					isUserLiked: {
						$cond: [{ $eq: [{ $size: '$isUserLiked' }, 1] }, true, false],
					},
				},
			},
			{
				$project: {
					_id: 1,
					user: {
						_id: 1,
						fullName: 1,
						avatar: 1,
						faculty: 1,
						department: 1,
						level: 1,
					},
					text: 1,
					images: 1,
					commentCount: 1,
					likeCount: 1,
					isUserLiked: 1,
					createdAt: 1,
				},
			},
		]);

		if (aggregationResult.length === 0) {
			throw new NotFoundError('post not found');
		}

		const post = aggregationResult[0];

		return post;
	}

	public static async commentOnPost(
		userId: Types.ObjectId,
		postId: Types.ObjectId,
		text: string
	) {
		const post = await this.getPost(postId, userId);

		const comment = await Comment.create({
			post: post._id,
			user: userId,
			text,
		});

		return comment;
	}

	public static async getPostComments(
		req: Request,
		res: Response,
		postId: Types.ObjectId
	) {
		const commentsQuery = Comment.find({ post: postId }).populate(
			'user',
			'fullName avatar faculty department level'
		);

		return await PaginationService.paginate(
			req,
			res,
			Comment,
			commentsQuery,
			'post comments retrieved successfully'
		);
	}

	public static async likePost(userId: Types.ObjectId, postId: Types.ObjectId) {
		let post = await this.getPost(postId, userId);

		const userLike = await Like.findOne({
			user: userId,
			post: postId,
		});

		const isLike = userLike ? false : true;

		if (userLike) {
			await userLike.remove();
		} else {
			await Like.create({
				user: userId,
				post: postId,
			});
		}

		post = await this.getPost(postId, userId);

		return { post, isLike };
	}

	public static async deletePost(
		userId: Types.ObjectId,
		postId: Types.ObjectId
	) {
		const post = await this.getPost(postId, userId);

		if (!userId.equals(post.user)) {
			throw new AuthFailureError('You cannot delete this post');
		}

		if (post.images.length > 0) {
			for (const image of post.images) {
				await deleteUpload(image);
			}
		}

		await post.remove();
	}
}

export default PostService;
