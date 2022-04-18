import { IIdTokens } from '../../interfaces/IdTokens';
import { IResult } from '../../interfaces/Result';
import { gradePoints } from '../helpers/constants';
import ScrapperService from './scrapper';

class UserService {
	public static async getResults(sessionId: string, session: string) {
		const results = await ScrapperService.getResults(sessionId, session);
		return results;
	}

	public static async calculateCGPA(sessionId: string, level: string) {
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
}

export default UserService;
