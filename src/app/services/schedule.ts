import { Response } from 'express';
import { Types } from 'mongoose';
import { NotFoundError } from '../../core/ApiError';
import Schedule from '../models/Schedule';

class ScheduleService {
	public static async getSchedules(res: Response) {
		return await res.advancedResults(Schedule, [
			{ path: 'user', select: 'fullName avatar faculty department level' },
		]);
	}

	public static async getSchedule(scheduleId: Types.ObjectId) {
		const schedule = await Schedule.findById(scheduleId).populate(
			'user',
			'fullName avatar faculty department level'
		);

		if (!schedule) {
			throw new NotFoundError(`Schedule with id ${scheduleId} not found`);
		}

		return schedule;
	}

	public static async createSchedule(
		userId: Types.ObjectId,
		scheduleData: {
			courseCode: string;
			courseTitle: string;
			venue: string;
			weekdays: string[];
			startTime: string;
			endTime: string;
			note?: string;
		}
	) {
		const schedule = await Schedule.create({
			user: userId,
			...scheduleData,
		});

		return schedule;
	}

	public static async updateSchedule(
		userId: Types.ObjectId,
		scheduleId: Types.ObjectId,
		scheduleData: {
			courseCode: string;
			courseTitle: string;
			venue: string;
			weekdays: string[];
			startTime: string;
			endTime: string;
			note?: string;
		}
	) {
		let schedule = await Schedule.findById(scheduleId);

		if (!schedule) {
			throw new NotFoundError(`Schedule with id ${scheduleId} not found`);
		}

		await schedule.updateOne(scheduleData);
		schedule = await Schedule.findById(scheduleId);

		return schedule;
	}

	public static async getUserSchedules(userId: Types.ObjectId) {
		const schedules = await Schedule.find({ user: userId });

		return schedules;
	}

	public static async deleteSchedule(
		userId: Types.ObjectId,
		scheduleId: Types.ObjectId
	) {
		let schedule = await Schedule.findById(scheduleId);

		if (!schedule) {
			throw new NotFoundError(`Schedule with id ${scheduleId} not found`);
		}

		await schedule.remove();
	}
}

export default ScheduleService;
