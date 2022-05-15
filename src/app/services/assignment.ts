import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthFailureError, NotFoundError } from '../../core/ApiError';
import Assignment from '../models/Assignment';

class AssignmentService {
	public static async getAssignments(res: Response) {
		return await res.advancedResults(Assignment, 'user');
	}

	public static async getAssignment(assignmentId: Types.ObjectId) {
		const assignment = await Assignment.findById(assignmentId);

		if (!assignment) {
			throw new NotFoundError(`Assignment with id ${assignmentId} not found`);
		}

		return assignment;
	}

	public static async createAssignment(
		userId: Types.ObjectId,
		assignmentData: {
			courseCode: string;
			courseTitle: string;
			lecturer: string;
		}
	) {
		const assignment = await Assignment.create({
			user: userId,
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

	public static async getUserAssignments(userId: Types.ObjectId) {
		const assignments = await Assignment.find({ user: userId });

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
