import { Document, Types } from 'mongoose';

export interface ScheduleDoc extends Document {
	user: Types.ObjectId;
	courseCode: string;
	courseTitle: string;
	venue: string;
	weekdays: string[];
	startTime: string;
	endTime: string;
	note?: string;
}
