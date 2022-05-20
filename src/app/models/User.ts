import { Schema, model } from 'mongoose';
import { UserDoc } from '../../interfaces/UserDoc';

const UserSchema = new Schema(
	{
		matricNumber: {
			type: String,
			unique: true,
			required: true,
			select: false,
		},
		fullName: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			required: true,
		},
		department: {
			type: String,
			required: true,
		},
		faculty: {
			type: String,
			required: true,
		},
		level: {
			type: String,
			required: true,
			enum: ['100', '200', '300', '400', '500'],
		},
	},
	{ timestamps: true }
);

export default model<UserDoc>('User', UserSchema);
