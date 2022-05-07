import { Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { Types } from 'mongoose';
import { BadRequestError, NotFoundError } from '../../core/ApiError';
import { UserDoc } from '../../interfaces/UserDoc';
import { uploadFile } from '../helpers/upload';
import Comment from '../models/Comment';
import Post from '../models/Post';

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

			if (images.length > 2) {
				throw new BadRequestError('Only 2 images are allowed');
			}

			for (let i = 0; i < images.length; i++) {
				const uploadedFile = await uploadFile(images[i], 'posts');
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
		return await res.advancedResults(Post, 'user');
	}

	public static async getPost(postId: Types.ObjectId) {
		const post = await Post.findById(postId).populate('user');

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
}

export default PostService;
