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
	let thisYear = new Date().getFullYear();
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
	r_val: 'placeholder',
	id: 'placeholder',
	p_id: 'placeholder',
};

const TEST_USER: IUser = {
	address: 'Placeholder Address',
	avatar: 'https://via.placeholder.com/150',
	chargesPaid: '0',
	course: 'Placeholder Course',
	department: 'Placeholder Department',
	dateOfBirth: new Date().toISOString(),
	faculty: 'Placeholder Faculty',
	fullName: 'John Doe',
	gender: 'male',
	guardian: {
		address: 'Placeholder Address',
		email: 'placeholderguardian@email.com',
		name: 'Placeholder Guardian',
		phoneNumber: '08000000000',
	},
	level: '100',
	levelAdviser: {
		email: 'placeholderleveladviser@mail.com',
		fullName: 'Placeholder Level Adviser',
		phoneNumber: '08000000000',
	},
	lgaOfOrigin: 'Placeholder LGA',
	matricNumber: testAccountMatricNumber!!,
	modeOfEntry: 'UTME',
	nextOfKin: {
		address: 'Placeholder Address',
		email: 'placeholdernextofkin@email.com',
		fullName: 'Placeholder Next of Kin',
		phoneNumber: '08000000000',
		relationship: 'Father',
	},
	phoneNumber: '08000000000',
	session: '2019/2020',
	semester: {
		number: '1',
		type: 'First',
		year: '2019',
	},
	signature: 'https://via.placeholder.com/150',
	sponsor: {
		address: 'Placeholder Address',
		email: 'placeholdersponsor@email.com',
		fullName: 'Placeholder Sponsor',
		phoneNumber: '08000000000',
	},
	stateOfOrigin: 'Placeholder State',
	studentEmail: 'placeholderstudent@eamil.com',
	studentShipStatus: 'Undergraduate',
	user: {
		matricNumber: testAccountMatricNumber!!,
		fullName: 'John Doe',
		avatar: 'https://via.placeholder.com/150',
		department: 'Placeholder Department',
		faculty: 'Placeholder Faculty',
		role: Role.TEST_USER,
		level: '100',
	} as UserDoc,
};

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
};
