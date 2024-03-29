import { UserDoc } from '../../interfaces/UserDoc';
import User from '../models/User';
import ScrapperService from './scrapper';
import { Role } from '../helpers/enums';
import { TEST_USER, TEST_USER_SESSION_ID } from '../helpers/constants';
import { testAccountPassword } from '../../configs';
import { AuthFailureError } from '../../core/ApiError';

class AuthService {
	public static async signin(matricNo: string, password: string) {
		if (matricNo === TEST_USER.matricNumber) {
			return await this.signinTestUser(password);
		}

		const sessionId = await ScrapperService.login(matricNo, password);

		const userProfile = await this.findOrCreateUser(matricNo, sessionId);

		return {
			sessionId,
			user: userProfile,
		};
	}

	private static async signinTestUser(password: string) {
		if (password !== testAccountPassword) {
			throw new AuthFailureError('Invalid credentials');
		}

		const user = await User.findOne({
			matricNumber: TEST_USER.matricNumber,
		});

		return {
			sessionId: TEST_USER_SESSION_ID,
			user: user!,
		};
	}

	private static async findOrCreateUser(
		matricNumber: string,
		sessionId: string
	) {
		let user = await User.findOne({
			matricNumber: matricNumber.toUpperCase(),
		});

		// First time login
		if (!user) {
			const dashboardPage = await ScrapperService.getDashboardPage(sessionId);
			const { profile, idTokens } =
				ScrapperService.getProfileSummary(dashboardPage);

			user = await User.create({
				matricNumber: profile.matricNumber,
				fullName: profile.fullName,
				avatar: profile.avatar,
				faculty: profile.faculty,
				department: profile.department,
				level: profile.level,
				role: Role.STUDENT,
				levelAdviser: profile.levelAdviser,
				semester: profile.semester,
				idTokens,
			});
		}

		// Existing users without new profile data
		if (!user.idTokens.rVal) {
			const dashboardPage = await ScrapperService.getDashboardPage(sessionId);
			const { idTokens, profile } =
				ScrapperService.getProfileSummary(dashboardPage);

			user.levelAdviser = profile.levelAdviser;
			user.semester = profile.semester;
			user.idTokens = idTokens;
			await user!.save();
		}

		return user as UserDoc;
	}

	public static async getLoggedInUser(sessionId: string, userProfile: UserDoc) {
		let studentProfile;

		if (userProfile!.role === Role.TEST_USER) {
			// eslint-disable-next-line no-unused-vars
			const { user, ...rest } = TEST_USER;
			studentProfile = rest;
		} else {
			studentProfile = await ScrapperService.getFullUserProfile(
				sessionId,
				userProfile!
			);
		}

		const user = { ...studentProfile, user: userProfile };

		return user;
	}

	public static async signout(sessionId: string) {
		if (sessionId !== TEST_USER_SESSION_ID) {
			await ScrapperService.signout(sessionId);
		}
	}
}

export default AuthService;
