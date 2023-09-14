import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { notification, message } from 'ant-design-vue'

// 定义传入的拦截器接口，并且都是可以可选的。
interface IRequestInterceptors<T = AxiosResponse> {
	// 请求成功时的拦截器
	requestSuccessInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
	// 请求失败时的拦截器
	requestErrorInterceptor?: (err: any) => any
	// 响应成功时的拦截器
	responseSuccessInterceptor?: (res: T) => T
	// 响应失败时的拦截器
	responseErrorInterceptor?: (err: any) => any
}

interface IRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
	// 每个request实例可以不传入拦截器
	interceptors?: IRequestInterceptors<T>
	// 是否显示loading
	loading?: Ref<boolean>
}

interface IResponseData extends AxiosResponse {
	config: IRequestConfig
}

/** 接口返回数据格式 */
/* interface ApiRes<T> {
	error?: { message: string }
	data: T
}*/

class Request {
	instance: AxiosInstance
	loading?: Ref<boolean>

	constructor(config: IRequestConfig) {
		this.instance = axios.create(config)

		// 创建实例请求拦截器
		this.instance.interceptors.request.use(
			config.interceptors?.requestSuccessInterceptor,
			config.interceptors?.requestErrorInterceptor,
		)

		// 创建实例响应拦截器
		this.instance.interceptors.response.use(
			config.interceptors?.responseSuccessInterceptor,
			config.interceptors?.responseErrorInterceptor,
		)

		/** 请求拦截器 */
		this.instance.interceptors.request.use(
			(config: IRequestConfig) => {
				console.log('请求拦截器-> success ', config)
				if (config.loading) {
					config.loading.value = true
				}
				return config
			},
			(error) => {
				console.log('请求拦截器-> err', error)
				return Promise.reject(error)
			},
		)
		/**  响应拦截器 */
		this.instance.interceptors.response.use(
			(response: IResponseData) => {
				if (response.config.loading) {
					response.config.loading.value = false
				}
				console.log('响应拦截器-> response', response)
				const data = response.data.data
				console.log('--------Data', data)
				if (data.error?.message) {
					// 如果错误信息长度过长，使用 Notification 进行提示
					if (data.error?.message.length <= 15) {
						message.error(data.error?.message?.message)
					} else {
						notification.error({
							message: 'Request error',
							duration: 1.8,
							description: data.error?.message?.message,
						})
					}
					return Promise.reject(new Error('Error'))
				}
				return response.data
			},
			(error) => {
				console.log('响应拦截器-> err', error)

				if (error.config.loading) {
					error.config.loading.value = false
				}

				if (error.response?.data) {
					if (error.response.data?.error) {
						notification.error({
							message: 'Request error',
							description: error.response.data.error.message,
							duration: 3,
						})
					} else {
						message.error('request error')
					}
				}
				message.destroy()
				return Promise.reject(error)
			},
		)
	}
	/** 通用请求工具函数 */
	request<T>(config: IRequestConfig<T>): Promise<T> {
		return new Promise((resolve, reject) => {
			// 创建单个请求的请求拦截器
			if (config.interceptors?.requestSuccessInterceptor) {
				// 直接调用，然后将处理后的config返回
				config = config.interceptors.requestSuccessInterceptor(config)
			}
			this.instance
				.request<any, T>(config)
				.then((res) => {
					// 调用传入的响应拦截器 [单个请求对返回数据的处理]
					if (config.interceptors?.responseSuccessInterceptor) {
						res = config.interceptors.responseSuccessInterceptor(res)
					}
					resolve(res)
				})
				.catch((err) => reject(err))
				.finally(() => {
					if (this.loading?.value) this.loading.value = false
				})
		})
	}

	get<T>(config: IRequestConfig<T>): Promise<T> {
		return this.request<T>({ ...config, method: 'GET' })
	}

	post<T>(config: IRequestConfig<T>): Promise<T> {
		return this.request<T>({ ...config, method: 'POST' })
	}

	delete<T>(config: IRequestConfig<T>): Promise<T> {
		return this.request<T>({ ...config, method: 'DELETE' })
	}

	patch<T>(config: IRequestConfig<T>): Promise<T> {
		return this.request<T>({ ...config, method: 'PATCH' })
	}

	put<T>(config: IRequestConfig<T>): Promise<T> {
		return this.request<T>({ ...config, method: 'PUT' })
	}
}

export default Request
