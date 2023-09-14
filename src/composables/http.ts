import Request from './axios'

const DEFAULT_CONFIG = {
	baseURL: '/api',
	timeout: 10 * 1000,
	showLoading: true,
	headers: {
		Accept: 'application/json, text/plain, */*',
		'Content-Type': 'application/json',
		'X-Requested-With': 'XMLHttpRequest',
	},
}

export const http = new Request({
	...DEFAULT_CONFIG,
	// interceptors: {
	// 	/**  请求拦截器 */
	// 	requestSuccessInterceptor: (config) => config,
	// 	requestErrorInterceptor: (err) => err,
	// 	/**  响应拦截器 */
	// 	responseSuccessInterceptor: (res) => res.data,
	// 	responseErrorInterceptor: (err) => err,
	// },
})
