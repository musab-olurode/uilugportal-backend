import cheerio from 'cheerio';
import { unilorinPortalUrl } from '../../configs';
import {
	AuthFailureError,
	ForbiddenError,
	InternalError,
} from '../../core/ApiError';
import { IIdTokens } from '../../interfaces/IdTokens';
import { obj } from '../../interfaces/obj';
import { IReceipt } from '../../interfaces/Receipt';
import { IResult } from '../../interfaces/Result';
import { IUserProfile } from '../../interfaces/UserProfile';
import { normalizeName } from '../helpers/constants';
import { PageTitle, RequestMethod } from '../helpers/enums';
import ApiService from './api';

class ScrapperService {
	private static handleFallback(
		scrapperPageResponse: string,
		message?: string
	) {
		console.log(scrapperPageResponse);
		throw new InternalError(message);
	}

	public static async login(matricNumber: string, password: string) {
		const payload = {
			username: matricNumber,
			password,
			ch: '',
			contentvar: 'main_login',
		};

		const portalResponse = await ApiService.handlePageRequest(
			'scriptfile_a.php',
			RequestMethod.POST,
			{},
			payload
		);

		const $ = cheerio.load(portalResponse.data);
		const portalResponseMessage = $('font').text();
		const portalResponseContents = $('script').contents();

		if (portalResponseMessage === 'Invalid login parameters') {
			throw new AuthFailureError('Invalid credentials');
		}

		if (
			portalResponseMessage ===
			'You can not have multiple sessions for your profile.'
		) {
			throw new ForbiddenError(portalResponseMessage);
		}

		if (
			portalResponseContents.length > 0 &&
			// eslint-disable-next-line quotes
			portalResponseContents[0].data?.trim() === "location='main.php';"
		) {
			const cookies = portalResponse.headers['set-cookie'];
			const sessionId = cookies?.[0].split(';')[0].split('=')[1];

			if (!sessionId) {
				this.handleFallback(
					portalResponse.data,
					'Cookie is missing from response'
				);
			}

			return sessionId;
		}

		this.handleFallback(portalResponse.data);
	}

	public static async getDashboardPage(sessionId: string) {
		const dashboardPage = await this.getPage(
			'main.php',
			sessionId,
			RequestMethod.GET,
			PageTitle.MAIN_MENU
		);

		return dashboardPage;
	}

	public static getIdTokens(dashboard: string) {
		const idTokens: IIdTokens = {
			r_val: '',
			id: '',
			p_id: '',
		};

		let $dashboard = cheerio.load(dashboard);

		$dashboard('[title="PERSONAL SETUP"]')
			.find('a')
			.map((i, el) => {
				let item = $dashboard(el).attr('href');
				let params = item?.toString().split('?')[1];
				let firstValues = params?.split('&');
				if (i === 1) {
					idTokens.r_val = firstValues?.[0].split('r_val=')[1] as string;
					idTokens.id = firstValues?.[1].split('id=')[1] as string;
				} else if (i === 2) {
					idTokens.p_id = firstValues?.[1].split('p_id=')[1] as string;
				}
			});

		return idTokens;
	}

	public static async getUserProfile(
		sessionId: string,
		idTokens: IIdTokens,
		dashboardPage?: string
	) {
		if (!dashboardPage) {
			dashboardPage = (await this.getDashboardPage(sessionId)) as string;
		}

		const profilePage = await this.getPage(
			`personal_details.php?r_val=${idTokens.r_val}&id=${idTokens.id}`,
			sessionId,
			RequestMethod.GET,
			PageTitle.PERSONAL_DETAILS
		);

		const $profile = cheerio.load(profilePage);
		const $dashboard = cheerio.load(dashboardPage);

		let dashboardData = $dashboard('#content')
			.find('td')
			.map((i, el) => $dashboard(el).text())
			.toArray();

		let images = $profile('#content')
			.find('img')
			.map((i, el) => `${unilorinPortalUrl}/${$profile(el).attr('src')}`)
			.toArray();

		let profileData = $profile('#content')
			.find('td')
			.map((i, el) => $profile(el).text())
			.toArray();

		// eslint-disable-next-line quotes
		let semester = $dashboard("[color='green']")
			.map((i, elem) => {
				if (i === 3) return $dashboard(elem).text();
			})
			.toArray();
		let semesterParts = semester[0].toString().split(' ');

		let userProfile: IUserProfile = {
			avatar: images[1].toString().trim(),
			signature: images[2].toString().trim(),
			matricNumber: profileData[2].toString().trim(),
			fullName: normalizeName(profileData[4].toString().trim()),
			session: profileData[5].toString().trim(),
			faculty: profileData[6].toString().trim(),
			department: profileData[7].toString().trim(),
			course: profileData[8].toString().trim(),
			level: profileData[3].toString().trim(),
			gender: profileData[9].toString().trim(),
			address: profileData[10].toString().trim(),
			studentEmail: profileData[11].toString().trim(),
			phoneNumber: profileData[12].toString().trim(),
			modeOfEntry: profileData[13].toString().trim(),
			studentShipStatus: profileData[14].toString().trim(),
			chargesPaid: profileData[15].toString().trim(),
			dateOfBirth: profileData[16].toString().trim(),
			stateOfOrigin: profileData[17].toString().trim(),
			lgaOfOrigin: profileData[18].toString().trim(),
			levelAdviser: {
				fullName: normalizeName(dashboardData[8].toString().trim()),
				email: dashboardData[9].toString().trim(),
				phoneNumber: dashboardData[10].toString().trim(),
			},
			nextOfKin: {
				fullName: normalizeName(profileData[21].toString().trim()),
				address: profileData[22].toString().trim(),
				relationship: profileData[23].toString().trim(),
				phoneNumber: profileData[24].toString().trim(),
				email: profileData[25].toString().trim(),
			},
			guardian: {
				name: normalizeName(profileData[27].toString().trim()),
				address: profileData[28].toString().trim(),
				phoneNumber: profileData[29].toString().trim(),
				email: profileData[30].toString().trim(),
			},
			sponsor: {
				fullName: normalizeName(profileData[32].toString().trim()),
				address: profileData[33].toString().trim(),
				phoneNumber: profileData[34].toString().trim(),
				email: profileData[35].toString().trim(),
			},
			semester: {
				type: semesterParts[0].trim(),
				number: semesterParts[1].replace(/\(|\)/g, '').trim().charAt(0),
				year: semesterParts[3].trim(),
			},
		};

		return userProfile;
	}

	public static async signout(sessionId: string) {
		const payload = {
			ref: 'index.php',
			contentvar: 'logout',
		};

		const logoutPage = await this.getPage(
			'scriptfile_a.php',
			sessionId,
			RequestMethod.POST,
			undefined,
			payload
		);

		const $logout = cheerio.load(logoutPage);

		if (
			$logout('script').contents().length === 0 &&
			$logout('script').contents()[0].data?.trim() !==
				// eslint-disable-next-line quotes
				"document.location='index.php';"
		) {
			throw new InternalError('Failed to signout');
		}
	}

	private static async getResultsPage(sessionId: string, session: string) {
		const payload = {
			session,
			contentvar: 'display_results',
			rtype: 'Sessional',
		};

		const resultUrlPage = await this.getPage(
			'scriptfile_a.php',
			sessionId,
			RequestMethod.POST,
			undefined,
			payload
		);

		const $resultUrl = cheerio.load(resultUrlPage);
		const resultUrlContents = $resultUrl('script').contents()[0].data?.trim();

		if (!resultUrlContents?.match(/location='results\.php\?r=(.*)/)) {
			this.handleFallback(resultUrlPage);
		}

		const resultLink = resultUrlContents!.split("='")[1];
		const resultPageUrl = resultLink?.slice(0, resultLink.length - 2);

		const resultsPage = await this.getPage(
			resultPageUrl,
			sessionId,
			RequestMethod.GET,
			PageTitle.RESULTS
		);

		return resultsPage;
	}

	public static async getResults(sessionId: string, session: string) {
		const resultsPage = await this.getResultsPage(sessionId, session);

		const $resultsPage = cheerio.load(resultsPage);

		let semester = '';

		// eslint-disable-next-line quotes
		const results = $resultsPage("[rules='all']")
			.find('tr')
			.map((i, el) => {
				let result: IResult = {
					semester: '',
					code: '',
					title: '',
					unit: '',
					status: '',
					ca: '',
					exam: '',
					total: '',
					grade: '',
				};
				let items = $resultsPage(el)
					.find('td')
					.map((i2, el2) => $resultsPage(el2).text())
					.toArray();
				if (items.length === 1) {
					semester = items[0].toString().trim();
				}
				if (items.length > 2 && items[1].toString().trim() !== 'Code') {
					result.semester = semester;
					result.code = items[1].toString().trim();
					result.title = items[2].toString().trim();
					result.unit = items[3].toString().trim();
					result.status = items[4].toString().trim();
					result.ca = items[5].toString().trim();
					result.exam = items[6].toString().trim();
					result.total = items[7].toString().trim();
					result.grade = items[8].toString().trim();
					return result;
				}
			})
			.toArray() as unknown as IResult[];

		return results;
	}

	public static async getPrintables(
		sessionId: string,
		session: string,
		idTokens: IIdTokens,
		currentLevel: number,
		levelForCourseForm: number,
		matricNumber: string
	) {
		const receiptsPage = await this.getPage(
			`print_course_form.php?id=rec&r_val=${idTokens.r_val}`,
			sessionId,
			RequestMethod.GET,
			PageTitle.COURSE_FORM
		);

		let $receipts = cheerio.load(receiptsPage);

		let paymentReceipts: IReceipt[] = [];

		$receipts('table').map((i, elem) => {
			if (i === 1) {
				$receipts(elem)
					.find('tr')
					.map((i2, el2) => {
						let row = $receipts(el2).find('td').toArray();
						let hrefs = $receipts(row[2]).find('a').toArray();
						let rowObject = {
							session: $receipts(row[1]).text(),
							name: $receipts(row[2]).text(),
							href: $receipts(hrefs[0]).attr('href') as string,
						};
						if (rowObject.href) {
							paymentReceipts.push(rowObject);
						}
					})
					.toArray();
			}
		});

		let paymentReceiptsWithPages: IReceipt[] = [];

		for (let i = 0; i < paymentReceipts.length; i++) {
			let receipt = paymentReceipts[i];
			let receiptAsPage = await this.getPage(
				receipt.href,
				sessionId,
				RequestMethod.GET,
				PageTitle.PAYMENT_RECEIPTS
			);

			receipt.href = receiptAsPage
				.replace(/href="/g, `href="${unilorinPortalUrl}/`)
				.replace(/src="(?!https)/g, `src="${unilorinPortalUrl}/`)
				.replace(/src='(?!https)/g, `src='${unilorinPortalUrl}/`);
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

		const courseFormPage = await this.getPage(
			'course_registration_printout.php',
			sessionId,
			RequestMethod.POST,
			PageTitle.COURSE_REGISTRATION,
			{ regno: matricNumber, session: levelString }
		);

		const resultsPage = await this.getResultsPage(sessionId, session);

		const printables = {
			paymentReceiptsWithPages,
			courseFormPage: courseFormPage
				.replace(/href="/g, `href="${unilorinPortalUrl}/`)
				.replace(/src="(?!https)/g, `src="${unilorinPortalUrl}/`)
				.replace(/src='(?!https)/g, `src='${unilorinPortalUrl}/`),
			resultsPage: resultsPage
				.replace(/href="/g, `href="${unilorinPortalUrl}/`)
				.replace(/src="(?!https)/g, `src="${unilorinPortalUrl}/`)
				.replace(/src='(?!https)/g, `src='${unilorinPortalUrl}/`),
		};

		return printables;
	}

	private static async getPage(
		url: string,
		sessionId: string,
		method: RequestMethod,
		pageTitle?: string,
		data?: obj
	) {
		const portalResponse = await ApiService.handlePageRequest(
			url,
			method,
			{ cookie: `PHPSESSID=${sessionId}` },
			data
		);

		const $ = cheerio.load(portalResponse.data);
		const portalContents = $('script').contents();
		const portalPageTitle = $('title').text().toString().trim();

		if (pageTitle) {
			if (
				// eslint-disable-next-line quotes
				portalContents[0]?.data?.trim() === "location='login.php';" ||
				// eslint-disable-next-line quotes
				(portalContents[0]?.data?.trim() === "location='index.php';" &&
					(portalPageTitle.split(': ')[1] !== pageTitle ||
						portalPageTitle !== pageTitle))
			) {
				throw new AuthFailureError('Not authorized to access this route');
			}
		}

		return portalResponse.data as string;
	}

	public static test() {
		const $ = cheerio.load(`
		  `);

		let rows: any[] = [];

		let semester = $('table').map((i, elem) => {
			if (i === 1) {
				$(elem)
					.find('tr')
					.map((i2, el2) => {
						let row = $(el2).find('td').toArray();
						let hrefs = $(row[2]).find('a').toArray();
						let rowObject = {
							session: $(row[1]).text(),
							name: $(row[2]).text(),
							href: $(hrefs[0]).attr('href'),
						};
						if (rowObject.href) {
							rows.push(rowObject);
						}
					})
					.toArray();
			}
		});

		return semester;
	}
}

export default ScrapperService;
