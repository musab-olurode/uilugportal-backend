import mongoose from 'mongoose';
// eslint-disable-next-line no-unused-vars
import colors from 'colors';
import { mongoUri } from '.';
import { Server } from 'http';

const TESTING = process.env.NODE_ENV === 'test';

const ConnectDB = async (serverListener: () => void) => {
	const conn = await mongoose.connect(mongoUri as string);

	!TESTING &&
		console.log(
			`------------- MongoDB Connected: ${conn.connection.host} ------------`
		);

	serverListener();
};

export default ConnectDB;
