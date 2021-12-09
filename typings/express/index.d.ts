declare namespace Express {
  interface Request {
    sessionId?: string;
    idTokens?: import('../../src/interfaces/IdTokens').IIdTokens;
    admin?: import('../../src/interfaces/UserDoc').UserDoc;
    validate: (
      args: import('validatorjs').Rules,
      customMessages?: import('validatorjs').ErrorMessages
    ) => Promise<void>;
    userType?: import('../../src/app/helpers/constants').UserType;
  }
  interface Response {
    advancedResults: (
      model: import('mongoose').Model<any>,
      populate?: string
    ) => Promise<any>;
  }
}
