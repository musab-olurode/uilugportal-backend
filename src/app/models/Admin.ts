import { Schema, model } from 'mongoose';
import { AdminDoc } from '../../interfaces/AdminDoc';

const AdminSchema = new Schema(
	{
		permissions: {
			type: [String],
		},
	},
	{ timestamps: true }
);

export default model<AdminDoc>('Admin', AdminSchema);
