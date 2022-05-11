import { Document, Types } from 'mongoose';

export interface AssignmentDoc extends Document {
	user: Types.ObjectId;
	courseCode: string;
	courseTitle: string;
	lecturer: string;
}
