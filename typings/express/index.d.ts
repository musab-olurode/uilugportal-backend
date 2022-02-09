/* eslint-disable no-unused-vars */
declare namespace Express {
	interface Request {
		sessionId?: string;
		idTokens?: import('../../src/interfaces/IdTokens').IIdTokens;
		admin?: import('../../src/interfaces/UserDoc').UserDoc;
		validate: (
			args: import('validatorjs').Rules,
			locations?: import('../../src/interfaces/ValidationLocation').ValidationLocation[],
			customMessages?: import('validatorjs').ErrorMessages
		) => Promise<Response | void>;
		userType?: import('../../src/app/helpers/constants').UserType;
		validated: () => any;
	}
	interface Response {
		advancedResults: (model: import('mongoose').Model<any>, populate?: string) => Promise<any>;
	}
}
