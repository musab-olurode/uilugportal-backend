import { Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { Types } from 'mongoose';
import {
	AuthFailureError,
	BadRequestError,
	NotFoundError,
} from '../../core/ApiError';
import { deleteUpload, uploadFile } from '../helpers/upload';
import Resource from '../models/Resource';

const MAX_FILES_PER_RESOURCE = 1;

class ResourceService {
	public static async getResources(res: Response) {
		return await res.advancedResults(Resource, [
			{ path: 'user', select: 'fullName avatar faculty department level' },
		]);
	}

	public static async getResource(resourceId: Types.ObjectId) {
		const resource = await Resource.findById(resourceId).populate(
			'user',
			'fullName avatar faculty department level'
		);

		if (!resource) {
			throw new NotFoundError(`Resource with id ${resourceId} not found`);
		}

		return resource;
	}

	public static async createResource(
		userId: Types.ObjectId,
		resourceData: {
			courseCode: string;
			courseTitle: string;
			topic: string;
		},
		file: UploadedFile | UploadedFile[]
	) {
		if (Array.isArray(file)) {
			throw new BadRequestError(
				`Only a maximum of ${MAX_FILES_PER_RESOURCE} file is allowed`
			);
		}

		const uploadedFile = await uploadFile(file, true, 'resources');
		const fileUrl = uploadedFile.url;

		const resource = await Resource.create({
			user: userId,
			file: fileUrl,
			...resourceData,
		});

		return resource;
	}

	public static async updateResource(
		userId: Types.ObjectId,
		resourceId: Types.ObjectId,
		resourceData: {
			courseCode: string;
			courseTitle: string;
			topic: string;
		},
		file?: UploadedFile | UploadedFile[]
	) {
		let resource = await Resource.findById(resourceId);

		if (!resource) {
			throw new NotFoundError(`Resource with id ${resourceId} not found`);
		}

		if (!resource.user.equals(userId)) {
			throw new AuthFailureError(
				'You are not authorized to update this resource'
			);
		}

		if (file) {
			if (Array.isArray(file)) {
				throw new BadRequestError(
					`Only a maximum of ${MAX_FILES_PER_RESOURCE} file is allowed`
				);
			}

			const uploadedFile = await uploadFile(file, true, 'resources');
			(resourceData as any).file = uploadedFile.url;

			await deleteUpload(resource.file);
		}

		await resource.updateOne(resourceData);
		resource = await Resource.findById(resourceId);

		return resource;
	}

	public static async getUserResources(userId: Types.ObjectId) {
		const resources = await Resource.find({ user: userId });

		return resources;
	}

	public static async deleteResource(
		userId: Types.ObjectId,
		resourceId: Types.ObjectId
	) {
		let resource = await Resource.findById(resourceId);

		if (!resource) {
			throw new NotFoundError(`Resource with id ${resourceId} not found`);
		}

		if (!resource.user.equals(userId)) {
			throw new AuthFailureError(
				'You are not authorized to delete this resource'
			);
		}

		await resource.remove();
	}
}

export default ResourceService;
