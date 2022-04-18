import { obj } from '../../interfaces/obj';

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

export {
	generateString,
	numberWithCommas,
	numberWithNaira,
	gradePoints,
	getSessions,
	getSessionsAsString,
	normalizeName,
};
