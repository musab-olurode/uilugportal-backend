import { Document } from 'mongoose';
import { Role } from '../app/helpers/enums';
import { IIdTokens } from './IdTokens';

export interface UserDoc extends Document {
	matricNumber: string;
	fullName: string;
	avatar: string;
	department: string;
	faculty: string;
	level: '100' | '200' | '300' | '400' | '500';
	role: Role;
	levelAdviser: {
		fullName: string;
		email: string;
		phoneNumber: string;
	};
	semester: {
		type: string;
		session: string;
		number: string;
	};
	idTokens: IIdTokens;
}
