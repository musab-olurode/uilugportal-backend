import app from './app';
import ConnectDB from './configs/database';
// eslint-disable-next-line no-unused-vars
import colors from 'colors';

const PORT = process.env.PORT || 5000;

const server = app;

// connect to database
ConnectDB(() =>
	server.listen(PORT, () =>
		console.log(
			`============= Server running in ${process.env.NODE_ENV} mode on port ${PORT} ==============`
		)
	)
);

// Handle unhandled promise rejections
// eslint-disable-next-line no-unused-vars
process.on('unhandledRejection', (err: any, promise) => {
	console.log(`Error: ${err.message}`);
	// Close server & exit process
	// server.close(() => process.exit(1));
});
