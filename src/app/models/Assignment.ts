import { Schema, model, Types } from 'mongoose';
import { AssignmentDoc } from '../../interfaces/AssignmentDoc';

const AssignmentSchema = new Schema<AssignmentDoc>(
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
	},
	{ timestamps: true }
);

export default model<AssignmentDoc>('Assignment', AssignmentSchema);
