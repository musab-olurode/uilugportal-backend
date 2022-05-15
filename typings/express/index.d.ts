/* eslint-disable no-unused-vars */
declare namespace Express {
	interface Request {
		user?: import('../../src/interfaces/UserDoc').UserDoc;
		sessionId?: string;
		idTokens?: import('../../src/interfaces/IdTokens').IIdTokens;
		admin?: import('../../src/interfaces/AdminDoc').AdminDoc;
		validate: (
			args: import('validatorjs').Rules,
			locations?: import('../../src/interfaces/ValidationLocation').ValidationLocation[],
			customMessages?: import('validatorjs').ErrorMessages
		) => Promise<Response | void>;
		validated: () => any;
	}
	interface Response {
		advancedResults: (
			model: import('mongoose').Model<any>,
			populate: { path: string; select?: string }[]
		) => Promise<any>;
	}
}
