declare namespace NodeJS {
	interface ProcessEnv {
		APP_NAME: string;
		NODE_ENV: 'development' | 'production' | 'test';
		APP_DEBUG: boolean;
		PORT: number;
		MONGO_URI: string;
		JWT_SECRET: string;
		JWT_EXPIRE: string;
		JWT_COOKIE_EXPIRE: number;
		CLIENT_URL: string;
		LIVE_CLIENT_URL: string;
		FILE_UPLOAD_PATH: string;
		SMTP_HOST: string;
		SMTP_PORT: string;
		SMTP_EMAIL: string;
		SMTP_PASSWORD: string;
		MAIL_FROM_EMAIL: string;
		MAIL_FROM_NAME: string;
		UNILORIN_PORTAL_URL: string;
	}
}
