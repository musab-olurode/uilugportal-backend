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
}

export interface IUser extends IStudentProfile {
	user: UserDoc;
}
