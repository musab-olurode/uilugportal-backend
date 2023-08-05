import { Schema, model } from 'mongoose';
import { UserDoc } from '../../interfaces/UserDoc';
import { Role } from '../helpers/enums';

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
		role: {
			type: String,
			enum: [Role.STUDENT, Role.CLASS_REP, Role.ASST_CLASS_REP, Role.TEST_USER],
			default: Role.STUDENT,
		},
		levelAdviser: {
			fullName: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			phoneNumber: {
				type: String,
				required: true,
			},
		},
		semester: {
			type: {
				type: String,
				required: true,
			},
			session: {
				type: String,
				required: true,
			},
			number: {
				type: String,
				required: true,
			},
		},
		idTokens: {
			rVal: {
				type: String,
				required: true,
			},
			id: {
				type: String,
				required: true,
			},
			pId: {
				type: String,
				required: true,
			},
		},
	},
	{ timestamps: true }
);

export default model<UserDoc>('User', UserSchema);
