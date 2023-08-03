import { IIdTokens } from '../../interfaces/IdTokens';
import { IResult } from '../../interfaces/Result';
import {
	TEST_USER,
	TEST_USER_ID_TOKENS,
	TEST_USER_SESSION_ID,
	gradePoints,
} from '../helpers/constants';
import User from '../models/User';
import ScrapperService from './scrapper';

class UserService {
	public static async getResults(sessionId: string, session: string) {
		if (sessionId === TEST_USER_SESSION_ID) return [];

		const results = await ScrapperService.getResults(sessionId, session);
		return results;
	}

	public static async calculateCGPA(sessionId: string, level: string) {
		if (sessionId === TEST_USER_SESSION_ID) return 4.0;

		let thisYear = new Date().getFullYear();
		let sessions = Number((level as string).charAt(0));

		let allResults: IResult[] = [];

		for (let i = 1; i <= sessions; i++) {
			let session = `${thisYear - 1}/${thisYear}`;
			const sessionResults = await this.getResults(sessionId, session);
			allResults = allResults.concat(sessionResults);
			--thisYear;
		}

		let qps = 0;
		let units = 0;
		let cgpa = 0;
		allResults.forEach((result) => {
			if (result.grade) {
				let qp = gradePoints[result.grade as string] * Number(result.unit);
				qps += qp;
				units += Number(result.unit);
			}
		});
		cgpa = Number((qps / units).toFixed(2));

		return cgpa;
	}

	public static async getPrintables(
		sessionId: string,
		session: string,
		idTokens: IIdTokens,
		currentLevel: number,
		levelForCourseForm: number,
		matricNumber: string
	) {
		if (sessionId === TEST_USER_SESSION_ID) {
			return {
				paymentReceiptsWithPages: [],
				courseFormPage: '',
				resultsPage: '',
			};
		}

		const printables = await ScrapperService.getPrintables(
			sessionId,
			session,
			idTokens,
			currentLevel,
			levelForCourseForm,
			matricNumber
		);
		return printables;
	}

	public static async getTestUser() {
		const sessionId = TEST_USER_SESSION_ID;
		const idTokens = TEST_USER_ID_TOKENS;

		let user = await User.findOne({
			matricNumber: TEST_USER.matricNumber,
		});

		if (!user) {
			user = await User.create({
				...TEST_USER.user,
			});
		}

		return { sessionId, idTokens, user };
	}
}

export default UserService;
