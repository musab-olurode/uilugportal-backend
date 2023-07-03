import { Types } from 'mongoose';
import { IIdTokens } from '../../interfaces/IdTokens';
import { UserDoc } from '../../interfaces/UserDoc';
import { IStudentProfile } from '../../interfaces/UserProfile';
import User from '../models/User';
import ScrapperService from './scrapper';
import { Role } from '../helpers/enums';

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

		const studentProfile = await ScrapperService.getUserProfile(
			sessionId,
			idTokens,
			dashboardPage
		);

		const userProfile = await this.findOrCreateUser(studentProfile);

		const user = { ...studentProfile, user: userProfile };

		return { sessionId, idTokens, user };
	}

	private static async findOrCreateUser(studentProfile: IStudentProfile) {
		let user = await User.findOne({
			matricNumber: studentProfile.matricNumber,
		});

		if (user) {
			if (user.faculty !== studentProfile.faculty) {
				user.faculty = studentProfile.faculty;
				await user.save();
			}
			if (user.department !== studentProfile.department) {
				user.department = studentProfile.department;
				await user.save();
			}
			if (
				user.level !== studentProfile.level &&
				parseInt(studentProfile.level) > parseInt(user.level)
			) {
				user.level = studentProfile.level;
				await user.save();
			}
		} else {
			user = await User.create({
				matricNumber: studentProfile.matricNumber,
				fullName: studentProfile.fullName,
				avatar: studentProfile.avatar,
				faculty: studentProfile.faculty,
				department: studentProfile.department,
				level: studentProfile.level,
				role: Role.STUDENT,
			});
		}

		return user as UserDoc;
	}

	public static async getLoggedInUser(
		sessionId: string,
		idTokens: IIdTokens,
		userId: Types.ObjectId
	) {
		const studentProfile = await ScrapperService.getUserProfile(
			sessionId,
			idTokens
		);

		const userProfile = await User.findById(userId);

		const user = { ...studentProfile, user: userProfile };

		return user;
	}

	public static async signout(sessionId: string) {
		await ScrapperService.signout(sessionId);
	}
}

export default AuthService;
