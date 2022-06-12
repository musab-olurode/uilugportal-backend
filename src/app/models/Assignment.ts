import { Schema, model, Types } from 'mongoose';
import { AssignmentDoc } from '../../interfaces/AssignmentDoc';

const AssignmentSchema = new Schema(
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
		lecturer: {
			type: String,
			required: true,
		},
		level: {
			type: String,
			required: true,
			enum: ['100', '200', '300', '400', '500'],
		},
		department: {
			type: String,
			required: true,
		},
		dueDate: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);

AssignmentSchema.index({ '$**': 'text' });

export default model<AssignmentDoc>('Assignment', AssignmentSchema);
