import { Document, Types } from 'mongoose';

export interface SubmittedAssignmentDoc extends Document {
	assignment: Types.ObjectId;
	user: Types.ObjectId;
	file: string;
}
