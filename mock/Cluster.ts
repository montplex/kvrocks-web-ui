import { MockMethod } from 'vite-plugin-mock'
import { NAMESPACE, CLUSTER } from '../src/types/const'

export default [
	//创建集群
	{
		url: `/api/v1/namespaces/${NAMESPACE}/clusters`,
		method: 'post',
		timeout: 400,
		response: {
			data: 'created',
		},
	},
	// 列表集群
	{
		url: `/api/v1/namespaces/${NAMESPACE}/clusters`,
		method: 'get',
		response: () => {
			return {
				data: {
					clusters: [
						'test-cluster',
						'test-cluster-2',
						'test-cluster-3',
						'test-cluster-4',
						'test-cluster-5',
					],
				},
			}
		},
	},

	// 获取集群
	{
		url: `/api/v1/namespaces/${NAMESPACE}/clusters/${CLUSTER}`,
		method: 'get',
		response: () => {
			return {
				data: {
					cluster: {
						name: 'test-cluster',
						version: 0,
						shards: [
							{
								nodes: [
									{
										id: '3SStZULMqclwvYNT8gN05IdybROe0vEnn97iNB5Z',
										addr: '127.0.0.1:6666',
										role: 'master',
										password: '',
										master_auth: '',
										created_at: 16834433980,
									},
								],
								slot_ranges: ['0-16383'],
								import_slot: -1,
								migrating_slot: -1,
							},
							{
								nodes: [
									{
										id: 'y5PftTd0Lc3hH34yEyavIji86cRM5i3oxytt42vo',
										addr: '127.0.0.1:6667',
										role: 'master',
										password: '',
										master_auth: '',
										created_at: 16834433980,
									},
								],
								slot_ranges: ['0-16666'],
								import_slot: 9,
								migrating_slot: 7,
							},
						],
					},
				},
			}
		},
	},
	// 删除集群
	{
		url: `/api/v1/namespaces/${NAMESPACE}/clusters/${CLUSTER}`,
		method: 'DELETE',
		timeout: 800,
		response: () => ({ data: 'ok' }),
	},
] as MockMethod[]
