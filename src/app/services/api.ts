import axios, { AxiosResponse, AxiosRequestHeaders } from 'axios';
import { obj } from '../../interfaces/obj';
import QueryString from 'qs';
import { portalUrl } from '../../configs';
import { RequestMethod } from '../helpers/enums';
import { InternalError } from '../../core/ApiError';

class ApiService {
	public static async request(
		url: string,
		method: RequestMethod,
		headers?: AxiosRequestHeaders,
		body?: any
	) {
		const response = await axios.request({
			url,
			method,
			headers,
			data: body,
		});

		return response;
	}

	public static async handlePageRequest(
		url: string,
		method = RequestMethod.GET,
		headers?: AxiosRequestHeaders,
		payload?: obj
	) {
		let portalResponse: AxiosResponse;

		try {
			portalResponse = await this.request(
				`${portalUrl}/${url}`,
				method,
				headers,
				payload && QueryString.stringify(payload)
			);
		} catch (error: any) {
			throw new InternalError(error.message);
		}

		return portalResponse;
	}
}

export default ApiService;
