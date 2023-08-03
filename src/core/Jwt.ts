import jwt, { VerifyOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { jwtExpire, jwtSecret } from '../configs';

class Jwt {
	public static issue(sessionId: string, _id: Types.ObjectId): string {
		return jwt.sign(
			{
				phpSessId: sessionId,
				_id,
			},
			jwtSecret as string,
			{
				expiresIn: jwtExpire,
			}
		);
	}

	public static verify(
		token: string,
		secret: string,
		options?: VerifyOptions
	): any {
		return jwt.verify(token, secret, options);
	}
}

export default Jwt;
