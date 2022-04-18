import { IIdTokens } from '../../interfaces/IdTokens';
import ScrapperService from './scrapper';

class AuthService {
	public static async signin(matricNo: string, password: string) {
		const sessionId = (await ScrapperService.login(
			matricNo,
			password
		)) as string;

		const dashboardPage = (await ScrapperService.getDashboardPage(
			sessionId
		)) as string;

		const idTokens = await ScrapperService.getIdTokens(dashboardPage);

		const user = await ScrapperService.getUserProfile(
			sessionId,
			idTokens,
			dashboardPage
		);

		return { sessionId, idTokens, user };
	}

	public static async getLoggedInUser(sessionId: string, idTokens: IIdTokens) {
		const user = await ScrapperService.getUserProfile(sessionId, idTokens);

		return user;
	}

	public static async signout(sessionId: string) {
		await ScrapperService.signout(sessionId);
	}
}

export default AuthService;
