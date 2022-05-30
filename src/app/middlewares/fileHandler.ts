import { NextFunction, Request, Response } from 'express';

const fileHandler = (req: Request, res: Response, next: NextFunction) => {
	if (req.files) {
		const newFiles = { ...req.files };
		Object.entries(newFiles).forEach(([key, file]) => {
			if (!Array.isArray(file)) {
				file = [file];
				newFiles[key] = file;
			}
			file.forEach((singleFile) => {
				(singleFile as any).isFile = true;
			});
		});
		req.files = newFiles;
	}
	next();
};

export default fileHandler;
