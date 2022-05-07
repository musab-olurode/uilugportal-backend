import mongoose from 'mongoose';
// eslint-disable-next-line no-unused-vars
import colors from 'colors';
import { mongoUri } from '.';

const TESTING = process.env.NODE_ENV === 'test';

const ConnectDB = async () => {
	const conn = await mongoose.connect(mongoUri as string, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	});

	!TESTING &&
		console.log(
			`
                                                ------------------ MongoDB Connected: ${conn.connection.host} -----------------
  `
		);
};

export default ConnectDB;
