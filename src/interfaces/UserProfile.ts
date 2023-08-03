import { UserDoc } from './UserDoc';

export type Level = '100' | '200' | '300' | '400' | '500';
export interface IStudentProfileSummary {
	avatar: string;
	matricNumber: string;
	fullName: string;
	faculty: string;
	department: string;
	course: string;
	level: Level;
	session: string;
}

export interface IStudentProfile extends IStudentProfileSummary {
	signature?: string;
	gender: string;
	address: string;
	studentEmail: string;
	phoneNumber: string;
	modeOfEntry: string;
	studentShipStatus: string;
	chargesPaid: string;
	dateOfBirth: string;
	stateOfOrigin: string;
	lgaOfOrigin: string;
	levelAdviser: {
		fullName: string;
		email: string;
		phoneNumber: string;
	};
	nextOfKin: {
		fullName: string;
		address: string;
		relationship: string;
		phoneNumber: string;
		email: string;
	};
	guardian: {
		name: string;
		address: string;
		phoneNumber: string;
		email: string;
	};
	sponsor: {
		fullName?: string;
		address: string;
		phoneNumber: string;
		email: string;
	};
	semester: {
		type: string;
		number: string;
		year: string;
	};
}

export interface IUser extends IStudentProfile {
	user: UserDoc;
}
