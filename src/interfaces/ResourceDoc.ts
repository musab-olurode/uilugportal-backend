import { Document, Types } from 'mongoose';

export interface ResourceDoc extends Document {
	user: Types.ObjectId;
	courseCode: string;
	courseTitle: string;
	topic: string;
	file: string;
}
