import { Document, Types } from 'mongoose';

export interface PostDoc extends Document {
	user: Types.ObjectId;
	text: string;
	images: string[];
	comments: Types.ObjectId[];
	likes: Types.ObjectId[];
}
