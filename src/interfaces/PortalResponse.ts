import { IResult } from './Result';
import { IStudentProfile } from './UserProfile';

export default interface IPortalResponse {
	success: boolean;
	message: string;
	code: number;
	sessionId?: string;
	url?: string;
	page?: string;
	userProfile?: IStudentProfile;
	result?: IResult[];
	data?: any;
}
