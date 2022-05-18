import { Schema, model, Types } from 'mongoose';
import { ScheduleDoc } from '../../interfaces/ScheduleDoc';

const ScheduleSchema = new Schema<ScheduleDoc>(
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
		venue: {
			type: String,
			required: true,
		},
		weekdays: {
			type: [String],
			enum: [
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday',
				'Sunday',
			],
		},
		startTime: {
			type: Date,
			required: true,
		},
		endTime: {
			type: Date,
			required: true,
		},
		note: String,
	},
	{ timestamps: true }
);

export default model<ScheduleDoc>('Schedule', ScheduleSchema);
