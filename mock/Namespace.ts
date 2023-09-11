import { MockMethod } from 'vite-plugin-mock'
import { NAMESPACE } from '../src/types/const'

export default [
	//创建命名空间
	{
		url: '/api/v1/namespaces',
		method: 'post',
		response: {
			data: 'created',
		},
	},
	// 列表命名空间
	{
		url: '/api/v1/namespaces',
		method: 'get',
		response: () => {
			return {
				data: {
					namespaces: [
						'test-ns',
						'test-ns1',
						'test-ns2',
						'test-ns3',
						'test-ns4',
					],
				},
			}
		},
	},
	// 删除命名空间/namespaces
	{
		url: `/api/v1/namespaces/${NAMESPACE}`,
		method: 'get',
		timeout: 800,
		response: () => ({ data: 'ok' }),
	},
] as MockMethod[]
