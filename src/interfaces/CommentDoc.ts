import { Document, Types } from 'mongoose';

export interface CommentDoc extends Document {
	user: Types.ObjectId;
	post?: Types.ObjectId;
	parentComment?: Types.ObjectId;
	text: string;
}
