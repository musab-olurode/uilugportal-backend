import { Document } from 'mongoose';

export interface UserDoc extends Document {
	matricNumber: string;
	fullName: string;
	avatar: string;
	department: string;
	faculty: string;
	level: '100' | '200' | '300' | '400' | '500';
}
