import { Document } from 'mongoose';
import { Role } from '../app/helpers/enums';

export interface UserDoc extends Document {
	matricNumber: string;
	fullName: string;
	avatar: string;
	department: string;
	faculty: string;
	level: '100' | '200' | '300' | '400' | '500';
	role: Role;
}
