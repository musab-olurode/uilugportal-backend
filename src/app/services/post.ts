import { Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { Types } from 'mongoose';
import {
	AuthFailureError,
	BadRequestError,
	NotFoundError,
} from '../../core/ApiError';
import { UserDoc } from '../../interfaces/UserDoc';
import { deleteUpload, uploadFile } from '../helpers/upload';
import Comment from '../models/Comment';
import Post from '../models/Post';

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

	public static async getPosts(res: Response) {
		return await res.advancedResults(Post, [
			{ path: 'user', select: 'fullName avatar faculty department level' },
		]);
	}

	public static async getPost(postId: Types.ObjectId) {
		const post = await Post.findById(postId).populate(
			'user',
			'fullName avatar faculty department level'
		);

		if (!post) {
			throw new NotFoundError('post not found');
		}

		return post;
	}

	public static async commentOnPost(
		userId: Types.ObjectId,
		postId: Types.ObjectId,
		text: string
	) {
		const post = await this.getPost(postId);

		const comment = await Comment.create({
			post: post._id,
			user: userId,
			text,
		});

		post.comments.push(comment._id);
		await post.save();

		return comment;
	}

	public static async likePost(userId: Types.ObjectId, postId: Types.ObjectId) {
		let post = await this.getPost(postId);

		if (post.likes.includes(userId)) {
			post.likes = post.likes.filter(
				(id) => id.toString() !== userId.toString()
			);
		} else {
			post.likes.push(userId);
		}

		await post.save();
		post = await this.getPost(postId);

		return post;
	}

	public static async deletePost(
		userId: Types.ObjectId,
		postId: Types.ObjectId
	) {
		const post = await this.getPost(postId);

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
