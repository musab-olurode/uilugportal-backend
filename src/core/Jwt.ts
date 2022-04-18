import jwt, { VerifyOptions } from 'jsonwebtoken';
import { jwtExpire, jwtSecret } from '../configs';
import { IIdTokens } from '../interfaces/IdTokens';

class Jwt {
	public static issue(sessionId: string, idTokens: IIdTokens): string {
		return jwt.sign(
			{
				phpSessId: sessionId,
				r_val: idTokens.r_val,
				id: idTokens.id,
				p_id: idTokens.p_id,
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
