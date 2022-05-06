import jwt, { VerifyOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { jwtExpire, jwtSecret } from '../configs';
import { IIdTokens } from '../interfaces/IdTokens';

class Jwt {
	public static issue(
		sessionId: string,
		idTokens: IIdTokens,
		_id: Types.ObjectId
	): string {
		return jwt.sign(
			{
				phpSessId: sessionId,
				r_val: idTokens.r_val,
				id: idTokens.id,
				p_id: idTokens.p_id,
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
