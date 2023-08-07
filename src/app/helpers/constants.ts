import { testAccountMatricNumber } from '../../configs';
import { IIdTokens } from '../../interfaces/IdTokens';
import { UserDoc } from '../../interfaces/UserDoc';
import { IUser } from '../../interfaces/UserProfile';
import { obj } from '../../interfaces/obj';
import { Role } from './enums';

const generateString = (
	length: number,
	useAlphabeticCharacters: boolean = true,
	useNumericCharacters: boolean = true
) => {
	var result = '';
	var characters = '';
	if (useAlphabeticCharacters) {
		characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	}
	if (useNumericCharacters) {
		characters = characters + '0123456789';
	}
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

const numberWithCommas = (number: string) => {
	const amount = parseFloat(number).toFixed(2);
	return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const numberWithNaira = (value: string) => '₦' + numberWithCommas(value);

const gradePoints: obj<number> = {
	A: 5,
	B: 4,
	C: 3,
	D: 2,
	E: 1,
	F: 0,
};

const getSessions = () => {
	let sessionYears: string[] = [];
	// subtract one to account for covid displacement
	let thisYear = new Date().getFullYear() - 1;
	for (let year = thisYear; year >= 2009; year--) {
		let session = `${year - 1}/${year}`;
		sessionYears.push(session.trim());
	}
	return sessionYears;
};

const normalizeName = (name: string) =>
	name
		.replace(',', '')
		.split(' ')
		.map(
			(nameSlice) =>
				nameSlice.charAt(0).toUpperCase() + nameSlice.slice(1).toLowerCase()
		)
		.join(' ');

const getSessionsAsString = () => {
	const sessionsAsArray = getSessions();
	const sessionsAsString = sessionsAsArray.join(',');
	return sessionsAsString;
};

const API_RESPONSE_PAGE_SIZE = 25;

const TEST_USER_SESSION_ID = 'placeholder';
const TEST_USER_ID_TOKENS: IIdTokens = {
	rVal: 'placeholder',
	id: 'placeholder',
	pId: 'placeholder',
};

const TEST_USER: IUser = {
	address: '11, Hikory Lane, Wakanda',
	avatar: 'https://i.pravatar.cc/300',
	chargesPaid: 'Yes',
	course: 'Bsc. Computer Science',
	department: 'Computer Science',
	dateOfBirth: new Date().toISOString(),
	faculty: 'Communication & Information Sciences',
	fullName: 'John Doe',
	gender: 'male',
	guardian: {
		address: '11, Hikory Lane, Wakanda',
		email: 'tom@email.com',
		fullName: 'Tom Doe',
		phoneNumber: '08000000000',
	},
	level: '100',
	levelAdviser: {
		email: 'larry@email.com',
		fullName: 'Larry Doe',
		phoneNumber: '08000000000',
	},
	lgaOfOrigin: 'Irepodun',
	matricNumber: testAccountMatricNumber!!,
	modeOfEntry: 'UTME',
	nextOfKin: {
		address: '11, Hikory Lane, Wakanda',
		email: 'jane@email.com',
		fullName: 'Jane Doe',
		phoneNumber: '08000000000',
		relationship: 'Sister',
	},
	phoneNumber: '08000000000',
	semester: {
		number: '1',
		session: '2019/2020',
		type: 'First',
	},
	signature: 'https://i.pravatar.cc/300',
	sponsor: {
		address: '11, Hikory Lane, Wakanda',
		email: 'kamal@email.com',
		fullName: 'Kamal Doe',
		phoneNumber: '08000000000',
	},
	stateOfOrigin: 'Kano',
	studentEmail: '19-0000000@email.com',
	studentShipStatus: 'Returning',
	user: {
		matricNumber: testAccountMatricNumber!!,
		fullName: 'John Doe',
		avatar: 'https://i.pravatar.cc/300',
		department: 'Computer Science',
		faculty: 'Communication & Information Sciences',
		role: Role.TEST_USER,
		level: '100',
		levelAdviser: {
			email: 'larry@email.com',
			fullName: 'Larry Doe',
			phoneNumber: '08000000000',
		},
		idTokens: TEST_USER_ID_TOKENS,
		semester: {
			number: '1',
			session: '2019/2020',
			type: 'First',
		},
	} as UserDoc,
};

const INVALID_CREDENTIALS_PORTAL_MESSAGE = 'Invalid login parameters';
const MULTIPLE_SESSION_PORTAL_MESSAGE =
	'You can not have multiple sessions for your profile.';

export {
	generateString,
	numberWithCommas,
	numberWithNaira,
	gradePoints,
	getSessions,
	getSessionsAsString,
	normalizeName,
	API_RESPONSE_PAGE_SIZE,
	TEST_USER,
	TEST_USER_SESSION_ID,
	TEST_USER_ID_TOKENS,
	MULTIPLE_SESSION_PORTAL_MESSAGE,
	INVALID_CREDENTIALS_PORTAL_MESSAGE,
};
