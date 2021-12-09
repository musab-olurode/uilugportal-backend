import jwt from 'jsonwebtoken';
import { IIdTokens } from '../../interfaces/IdTokens';

const getSignedJwtToken = (sessionId: string, idTokens: IIdTokens) => {
  return jwt.sign(
    {
      phpSessId: sessionId,
      r_val: idTokens.r_val,
      id: idTokens.id,
      p_id: idTokens.p_id
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

export { getSignedJwtToken };
