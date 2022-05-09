import { Request, Response } from 'express';
import INews from '../../interfaces/News';
import IPagination from '../../interfaces/Pagination';
import ScrapperService from './scrapper';

const TEAM_PLATO_PAGE_SIZE = 12;
const UNILORIN_SU_PAGE_SIZE = 18;
const TEAM_BABS_PAGE_SIZE = 10;

class NewsService {
	public static async getNews(req: Request, res: Response) {
		return req.query.source === 'unilorinsu'
			? await this.getNewsFromUnilorinSU(req, res)
			: req.query.source === 'teamplato'
			? await this.getNewsFromTeamPlato(req, res)
			: await this.getNewsFromTeamBabs(req, res);
	}

	private static async getNewsFromUnilorinSU(req: Request, res: Response) {
		const page = parseInt(req.query.page as string) || 1;

		const scrappedNews = await ScrapperService.getUnilorinSuNews(page);

		const limit = UNILORIN_SU_PAGE_SIZE,
			total = scrappedNews.totalPages * limit;

		return this.getPaginatedNewsResponse(page, limit, total, scrappedNews, res);
	}

	private static async getNewsFromTeamPlato(req: Request, res: Response) {
		const page = parseInt(req.query.page as string) || 1;

		const scrappedNews = await ScrapperService.getTeamPlatoNews(page);

		const limit = TEAM_PLATO_PAGE_SIZE,
			total = scrappedNews.totalPages * limit;

		return this.getPaginatedNewsResponse(page, limit, total, scrappedNews, res);
	}

	private static async getNewsFromTeamBabs(req: Request, res: Response) {
		const page = parseInt(req.query.page as string) || 1;

		const scrappedNews = await ScrapperService.getTeamBabsNews(page);

		const limit = TEAM_BABS_PAGE_SIZE,
			total = scrappedNews.totalPages * limit;

		return this.getPaginatedNewsResponse(page, limit, total, scrappedNews, res);
	}

	private static getPaginatedNewsResponse(
		page: number,
		limit: number,
		total: number,
		scrappedNews: { news: INews[]; totalPages: number },
		res: Response
	) {
		const pagination: IPagination = {
			current: page,
			limit,
			total,
		};

		if (page < scrappedNews.totalPages) {
			pagination.next = {
				page: page + 1,
				limit,
				total,
			};
		}

		if (page > 1) {
			pagination.prev = {
				page: page - 1,
				limit,
				total,
			};
		}

		return res.status(200).json({
			success: true,
			message: 'news retrieved',
			data: scrappedNews.news,
			count: scrappedNews.news.length,
			pagination,
		});
	}
}

export default NewsService;
