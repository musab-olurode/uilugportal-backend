import { Document, Types } from 'mongoose';

export interface LikeDoc extends Document {
	user: Types.ObjectId;
	post: Types.ObjectId;
}
