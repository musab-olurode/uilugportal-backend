import cheerio from 'cheerio';
import { NextFunction, Request, Response } from 'express';
import { getSessionsAsString } from '../helpers/constants';
import { successResponse, errorResponse } from '../helpers/response';
import asyncHandler from '../middlewares/async';

// eslint-disable-next-line no-unused-vars
export const testFunction = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	// const $ = cheerio.load(`
	//   `);

	// let rows: any[] = [];

	// let semester = $('table').map((i, elem) => {
	// 	if (i === 1) {
	// 		$(elem)
	// 			.find('tr')
	// 			.map((i2, el2) => {
	// 				let row = $(el2).find('td').toArray();
	// 				let hrefs = $(row[2]).find('a').toArray();
	// 				let rowObject = {
	// 					session: $(row[1]).text(),
	// 					name: $(row[2]).text(),
	// 					href: $(hrefs[0]).attr('href'),
	// 				};
	// 				if (rowObject.href) {
	// 					rows.push(rowObject);
	// 				}
	// 			})
	// 			.toArray();
	// 	}
	// });

	let user = getSessionsAsString();

	successResponse(res, '', { user });
});
