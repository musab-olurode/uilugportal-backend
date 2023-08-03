import jwt from 'jsonwebtoken';
import asyncHandler from './async';
import Admin from '../models/Admin';
import { NextFunction, Request, Response } from 'express';
import { AuthFailureError, ForbiddenError } from '../../core/ApiError';
import Jwt from '../../core/Jwt';
import { jwtSecret } from '../../configs';
import User from '../models/User';
import { Role } from '../helpers/enums';

// Protect routes
const protect = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let token;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			// Set token from Bearer token in header
			token = req.headers.authorization.split(' ')[1];
			// Set token from cookie
		} else if (req.cookies.token) {
			token = req.cookies.token;
		}
		// Make sure token exists
		if (!token) {
			throw new AuthFailureError('Invalid authorization');
		}

		try {
			// Verify token
			const decoded = Jwt.verify(token, jwtSecret as string);
			let sessionId: string = (decoded as any).phpSessId;
			if (!sessionId) {
				throw new AuthFailureError('Session id missing from token');
			}
			const user = await User.findById((decoded as any)._id);
			if (!user) {
				throw new AuthFailureError('Invalid user id');
			}
			req.user = user;
			req.sessionId = sessionId;
			next();
		} catch (err) {
			throw new AuthFailureError('Invalid authorization');
		}
	}
);

// Grant access to only admins
const admin = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let token;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			// Set token from Bearer token in header
			token = req.headers.authorization.split(' ')[1];
			// Set token from cookie
		} else if (req.cookies.token) {
			token = req.cookies.token;
		}
		// Make sure token exists
		if (!token) {
			throw new AuthFailureError('Invalid authorization');
		}

		try {
			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
			let admin = await Admin.findById((decoded as any).id);
			if (!admin) {
				throw 'error';
			}
			req.admin = admin;
			next();
		} catch (err) {
			throw new AuthFailureError('Invalid authorization');
		}
	}
);

// Grant access to specific admin permissions
const authorizeAdmin = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (req.admin?._id) {
			throw new ForbiddenError('Invalid authorization');
		}
		next();
	};
};

// Grant access to specific roles
const authorize = (...roles: Role[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user!.role)) {
			throw new AuthFailureError('Invalid authorization');
		}
		next();
	};
};

export { protect, admin, authorizeAdmin, authorize };
