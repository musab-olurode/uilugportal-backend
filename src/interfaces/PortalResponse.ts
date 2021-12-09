import { IResult } from './Result';
import { IUserProfile } from './UserProfile';

export default interface IPortalResponse {
  success: boolean;
  message: string;
  code: number;
  sessionId?: string;
  url?: string;
  page?: string;
  userProfile?: IUserProfile;
  result?: IResult[];
  data?: any;
}
