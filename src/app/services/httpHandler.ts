import axios, { AxiosResponse, AxiosRequestHeaders } from 'axios';
import { obj } from '../../interfaces/obj';
import QueryString from 'qs';
import cheerio from 'cheerio';
import IPortalResponse from '../../interfaces/PortalResponse';
import { IIdTokens } from '../../interfaces/IdTokens';
import { scrapPaymentReceipts, scrapResults, scrapUserProfile } from './scrapperService';

const portalUrl = 'https://uilugportal.unilorin.edu.ng';

const handleAuthRequest = async (url: string, payload: obj, headers?: AxiosRequestHeaders) => {
	let response: IPortalResponse = {
		success: false,
		message: 'Oops! Something went wrong',
		code: 500,
	};

	await axios
		.post(`${portalUrl}/${url}`, QueryString.stringify(payload), { headers })
		.then((res: AxiosResponse) => {
			const $ = cheerio.load(res.data);
			if ($('font').text() === 'Invalid login parameters') {
				response.message = 'Invalid username or password';
				response.code = 401;
			} else if ($('font').text() === 'You can not have multiple sessions for your profile.') {
				response.message = $('font').text();
				response.code = 403;
			} else if (
				$('script').contents().length > 0 &&
				// eslint-disable-next-line quotes
				$('script').contents()[0].data?.trim() === "location='main.php';"
			) {
				response.success = true;
				response.message = 'logged in successfully';
				response.code = 200;
				const cookies = res.headers['set-cookie'];
				response.sessionId = cookies?.[0].split(';')[0].split('=')[1];
				if (!response.sessionId) throw 'Cookie is missing from response';
			} else if (
				$('script').contents().length > 0 &&
				$('script').contents()[0].data?.trim() ===
					// eslint-disable-next-line quotes
					"document.location='index.php';"
			) {
				response.success = true;
				response.message = 'logged out successfully';
				response.code = 200;
			} else if (
				$('script')
					.contents()[0]
					.data?.trim()
					.match(/location='results\.php\?r=(.*)/)
			) {
				// eslint-disable-next-line quotes
				let link = $('script').contents()[0].data?.trim().split("='")[1];
				response.url = link?.slice(0, link.length - 2);
				response.success = true;
				response.message = 'result page url retrieved successfully';
			} else {
				console.log(res.data);
			}
		})
		.catch((error) => {
			console.log(error);
		});

	return response;
};

const handlePageRequest = async (
	url: string,
	pageTitle: string,
	headers?: AxiosRequestHeaders,
	method = 'GET',
	payload?: obj
) => {
	const response: IPortalResponse = {
		success: false,
		message: 'error loading secure page',
		sessionId: '',
		code: 500,
		page: '',
	};

	if (method === 'GET') {
		await axios
			.get(`${portalUrl}/${url}`, { headers })
			.then((res: AxiosResponse) => {
				const $ = cheerio.load(res.data);
				if (
					// eslint-disable-next-line quotes
					$('script').contents()[0]?.data?.trim() !== "location='login.php';" &&
					// eslint-disable-next-line quotes
					$('script').contents()[0]?.data?.trim() !== "location='index.php';" &&
					($('title').text().toString().trim().split(': ')[1] === pageTitle ||
						$('title').text().toString().trim() === pageTitle)
				) {
					response.success = true;
					response.message = 'page loaded successfully';
					response.page = res.data;
				} else if (
					// eslint-disable-next-line quotes
					$('script').contents()[0].data?.trim() === "location='login.php';" ||
					// eslint-disable-next-line quotes
					$('script').contents()[0].data?.trim() === "location='index.php';"
				) {
					response.message = 'Not authorized to access this route';
					response.code = 401;
				} else {
					console.log(res.data);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	} else {
		await axios
			.post(`${portalUrl}/${url}`, QueryString.stringify(payload), { headers })
			.then((res: AxiosResponse) => {
				const $ = cheerio.load(res.data);
				if (
					// eslint-disable-next-line quotes
					$('script').contents()[0]?.data?.trim() !== "location='login.php';" &&
					// eslint-disable-next-line quotes
					$('script').contents()[0]?.data?.trim() !== "location='index.php';" &&
					($('title').text().toString().trim().split(': ')[1] === pageTitle ||
						$('title').text().toString().trim() === pageTitle)
				) {
					response.success = true;
					response.message = 'page loaded successfully';
					response.page = res.data;
				} else if (
					// eslint-disable-next-line quotes
					$('script').contents()[0].data?.trim() === "location='login.php';" ||
					// eslint-disable-next-line quotes
					$('script').contents()[0].data?.trim() === "location='index.php';"
				) {
					response.message = 'Not authorized to access this route';
					response.code = 401;
				} else {
					console.log(res.data);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return response;
};

const loginToPortal = async (payload: obj) => {
	payload.ch = '';
	payload.contentvar = 'main_login';
	return handleAuthRequest('scriptfile_a.php', payload);
};

const logoutFromPortal = async (sessionId: string) => {
	const payload = {
		ref: 'index.php',
		contentvar: 'logout',
	};
	return await handleAuthRequest('scriptfile_a.php', payload, {
		cookie: `PHPSESSID=${sessionId}`,
	});
};

const getDashboardPage = async (sessionId: string) => {
	return await handlePageRequest('main.php', 'Main Menu', {
		cookie: `PHPSESSID=${sessionId}`,
	});
};

const getLoggedInUser = async (sessionId: string, idTokens: IIdTokens) => {
	let response: IPortalResponse = {
		success: true,
		message: 'data retrieved',
		sessionId: '',
		code: 200,
	};

	const dashboard = await getDashboardPage(sessionId);
	const profile = await handlePageRequest(
		`personal_details.php?r_val=${idTokens.r_val}&id=${idTokens.id}`,
		'Personal Details',
		{
			cookie: `PHPSESSID=${sessionId}`,
		}
	);

	if (!dashboard.success) {
		response.success = false;
		response.message = dashboard.message;
		response.code = dashboard.code;
		return response;
	}
	if (!profile.success) {
		response.success = false;
		response.message = profile.message;
		response.code = profile.code;
		return response;
	}

	response.userProfile = scrapUserProfile(dashboard.page as string, profile.page as string);
	return response;
};

const getResults = async (sessionId: string, payload: obj) => {
	let response: IPortalResponse = {
		success: true,
		message: 'data retrieved',
		sessionId: '',
		code: 200,
	};
	payload.contentvar = 'display_results';
	payload.rtype = 'Sessional';

	const resultPageUrl = await handleAuthRequest('scriptfile_a.php', payload, {
		cookie: `PHPSESSID=${sessionId}`,
	});
	if (!resultPageUrl.success) {
		response.success = false;
		response.message = resultPageUrl.message;
		response.code = resultPageUrl.code;
		return response;
	}
	const resultsPage = await handlePageRequest(resultPageUrl.url as string, 'Results', {
		cookie: `PHPSESSID=${sessionId}`,
	});
	if (!resultsPage.success) {
		response.success = false;
		response.message = resultsPage.message;
		response.code = resultsPage.code;
		return response;
	}

	response.result = scrapResults(resultsPage.page as string);
	return response;
};

const getPrintables = async (
	sessionId: string,
	payload: obj,
	idTokens: IIdTokens,
	currentLevel: number,
	levelForCourseForm: number,
	matricNumber: string
) => {
	let response: IPortalResponse = {
		success: true,
		message: 'data retrieved',
		sessionId: '',
		code: 200,
	};
	payload.contentvar = 'display_results';
	payload.rtype = 'Sessional';

	const receiptsPage = await handlePageRequest(
		`print_course_form.php?id=rec&r_val=${idTokens.r_val}`,
		'University of Ilorin:',
		{
			cookie: `PHPSESSID=${sessionId}`,
		}
	);
	let paymentReceipts = await scrapPaymentReceipts(receiptsPage.page as string);

	let paymentReceiptsWithPages: any[] = [];

	for (let i = 0; i < paymentReceipts.length; i++) {
		let receipt = paymentReceipts[i];
		let receiptAsPage = await handlePageRequest(receipt.href, 'PAYMENT RECEIPTS', {
			cookie: `PHPSESSID=${sessionId}`,
		});
		if (!receiptAsPage.success) {
			response.success = false;
			response.message = receiptAsPage.message;
			response.code = receiptAsPage.code;
			return response;
		}
		receipt.href = receiptAsPage.page
			?.replace(/href="/g, `href="${portalUrl}/`)
			.replace(/src="(?!https)/g, `src="${portalUrl}/`)
			.replace(/src='(?!https)/g, `src='${portalUrl}/`);
		paymentReceiptsWithPages.push(receipt);
	}

	let thisYear = new Date().getFullYear();

	let levelString = '';

	for (let i = currentLevel; i > 0; i -= 100) {
		if (levelForCourseForm === i) {
			levelString = `${thisYear - 1}/${thisYear}***${currentLevel}`;
		}
		--thisYear;
	}

	const courseFormPage = await handlePageRequest(
		'course_registration_printout.php',
		'Instruction',
		{
			cookie: `PHPSESSID=${sessionId}`,
		},
		'POST',
		{ regno: matricNumber, session: levelString }
	);

	if (!courseFormPage.success) {
		response.success = false;
		response.message = courseFormPage.message;
		response.code = courseFormPage.code;
		return response;
	}

	const resultPageUrl = await handleAuthRequest('scriptfile_a.php', payload, {
		cookie: `PHPSESSID=${sessionId}`,
	});
	if (!resultPageUrl.success) {
		response.success = false;
		response.message = resultPageUrl.message;
		response.code = resultPageUrl.code;
		return response;
	}

	const resultsPage = await handlePageRequest(resultPageUrl.url as string, 'Results', {
		cookie: `PHPSESSID=${sessionId}`,
	});
	if (!resultsPage.success) {
		response.success = false;
		response.message = resultsPage.message;
		response.code = resultsPage.code;
		return response;
	}

	response.data = {
		paymentReceiptsWithPages,
		courseFormPage: courseFormPage.page
			?.replace(/href="/g, `href="${portalUrl}/`)
			.replace(/src="(?!https)/g, `src="${portalUrl}/`)
			.replace(/src='(?!https)/g, `src='${portalUrl}/`),
		resultsPage: resultsPage.page
			?.replace(/href="/g, `href="${portalUrl}/`)
			.replace(/src="(?!https)/g, `src="${portalUrl}/`)
			.replace(/src='(?!https)/g, `src='${portalUrl}/`),
	};

	let test = response.data;

	return response;
};

export { loginToPortal, logoutFromPortal, getDashboardPage, getLoggedInUser, getResults, getPrintables };
