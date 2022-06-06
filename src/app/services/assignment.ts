import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthFailureError, NotFoundError } from '../../core/ApiError';
import { UserDoc } from '../../interfaces/UserDoc';
import { Role } from '../helpers/enums';
import Assignment from '../models/Assignment';

class AssignmentService {
	public static async getAssignments(res: Response) {
		return await res.advancedResults(Assignment, [
			{ path: 'user', select: 'fullName avatar faculty department level' },
		]);
	}

	public static async getAssignment(assignmentId: Types.ObjectId) {
		const assignment = await Assignment.findById(assignmentId).populate(
			'user',
			'fullName avatar faculty department level'
		);

		if (!assignment) {
			throw new NotFoundError(`Assignment with id ${assignmentId} not found`);
		}

		return assignment;
	}

	public static async createAssignment(
		user: UserDoc,
		assignmentData: {
			courseCode: string;
			courseTitle: string;
			lecturer: string;
		}
	) {
		if (user.role != Role.CLASS_REP && user.role != Role.ASST_CLASS_REP) {
			throw new AuthFailureError(
				'You are not authorized to create assignments'
			);
		}

		const assignment = await Assignment.create({
			user: user._id,
			level: user.level,
			department: user.department,
			...assignmentData,
		});

		return assignment;
	}

	public static async updateAssignment(
		userId: Types.ObjectId,
		assignmentId: Types.ObjectId,
		assignmentData: {
			courseCode: string;
			courseTitle: string;
			lecturer: string;
		}
	) {
		let assignment = await this.getAssignment(assignmentId);

		if (!assignment.user.equals(userId)) {
			throw new AuthFailureError(
				'You are not authorized to update this assignment'
			);
		}

		await assignment.updateOne(assignmentData);
		assignment = await this.getAssignment(assignmentId);

		return assignment;
	}

	public static async getUserAssignments(user: UserDoc) {
		const assignments = await Assignment.find({
			level: user.level,
			department: user.department,
		});

		return assignments;
	}

	public static async deleteAssignment(
		userId: Types.ObjectId,
		assignmentId: Types.ObjectId
	) {
		const assignment = await this.getAssignment(assignmentId);

		if (!assignment.user.equals(userId)) {
			throw new AuthFailureError(
				'You are not authorized to delete this assignment'
			);
		}

		await assignment.remove();
	}
}

export default AssignmentService;
