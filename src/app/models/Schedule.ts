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
			required: true,
			enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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

ScheduleSchema.index({ '$**': 'text' });

export default model<ScheduleDoc>('Schedule', ScheduleSchema);
