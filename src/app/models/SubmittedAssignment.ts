import { Schema, model, Types } from 'mongoose';
import { SubmittedAssignmentDoc } from '../../interfaces/SubmittedAssignmentDoc';

const SubmittedAssignmentSchema = new Schema(
	{
		assignment: {
			type: Types.ObjectId,
			ref: 'Assignment',
			required: true,
		},
		user: {
			type: Types.ObjectId,
			ref: 'User',
			required: true,
		},
		file: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default model<SubmittedAssignmentDoc>(
	'SubmittedAssignment',
	SubmittedAssignmentSchema
);
