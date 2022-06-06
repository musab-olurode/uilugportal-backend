import { Document, Types } from 'mongoose';

export interface AssignmentDoc extends Document {
	user: Types.ObjectId;
	courseCode: string;
	courseTitle: string;
	lecturer: string;
	level: '100' | '200' | '300' | '400' | '500';
	department: string;
}
