import { v2 as cloudinary } from 'cloudinary';
import DataURIParser from 'datauri/parser';
import {
	cloudinaryApiKey,
	cloudinaryApiSecret,
	cloudinaryCloudName,
} from '../../configs';
import { InternalError } from '../../core/ApiError';
import path from 'path';
import { UploadedFile } from 'express-fileupload';

const dataUri = new DataURIParser();

cloudinary.config({
	cloud_name: cloudinaryCloudName,
	api_key: cloudinaryApiKey,
	api_secret: cloudinaryApiSecret,
});

const cloudinaryUploader = cloudinary.uploader;

/**
 * @description This function converts the buffer to data url
 * @param {Object} file The file to be converted
 * @returns {String} The data url from the string buffer
 */
const formatAsDataUri = (file: UploadedFile) =>
	dataUri.format(file.name, file.data);

/**
 * @description This function uploads images to cloudinary
 * @param  {object} file The image uri to be uploaded
 * @param  {object} res http response object
 * @param {object} fields The request body
 * @returns {object} returns the response object cloudinary which contains the image url
 */
export const uploadFile = async (
	file: UploadedFile,
	useFileName = true,
	folder?: string
) => {
	const uploadedFile = {
		url: '',
		public_id: '',
	};

	const formattedFile = formatAsDataUri(file);

	const options = {
		folder: folder || 'media',
		resource_type: 'auto',
		use_filename: useFileName,
		filename_override: file.name,
		timeout: 600000,
	};

	try {
		const result = await cloudinaryUploader.upload(
			formattedFile.content as string,
			options
		);
		uploadedFile.url = result.secure_url;
		uploadedFile.public_id = result.public_id;
	} catch (error: any) {
		throw new InternalError(error.message);
	}

	return uploadedFile;
};

export const deleteUpload = async (url: string) => {
	try {
		const tempe = url.split('/');
		const public_id = tempe[tempe.length - 1].split('.')[0];
		await cloudinaryUploader.destroy(public_id);
	} catch (error: any) {
		throw new InternalError(error.message);
	}
};

export default { uploadFile };
