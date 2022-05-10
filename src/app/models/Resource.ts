import { Schema, model, Types } from 'mongoose';
import { ResourceDoc } from '../../interfaces/ResourceDoc';

const ResourceSchema = new Schema<ResourceDoc>(
	{
		user: {
			type: Types.ObjectId,
			ref: 'User',
			required: true,
		},
		courseCode: {
			type: String,
			required: true,
		},
		courseTitle: {
			type: String,
			required: true,
		},
		topic: {
			type: String,
			required: true,
		},
		file: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default model<ResourceDoc>('Resource', ResourceSchema);
