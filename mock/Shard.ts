import { MockMethod } from 'vite-plugin-mock'
import { NAMESPACE, CLUSTER, SHARD } from '../src/types/const'

export default [
	//创建分片
	{
		url: `/api/v1/namespaces/${NAMESPACE}/clusters/${CLUSTER}/shards`,
		method: 'post',
		response: {
			data: 'created',
		},
	},
	// 获取分片
	{
		url: `/api/v1/namespaces/${NAMESPACE}/clusters/${CLUSTER}/shards/${SHARD}`,
		method: 'get',
		response: () => {
			return {
				data: {
					shard: {
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
				},
			}
		},
	},
	// 列表分片
	{
		url: `/api/v1/namespaces/${NAMESPACE}/clusters/${CLUSTER}/shards`,
		method: 'get',
		response: () => {
			return {
				data: {
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
							slot_ranges: null,
							import_slot: -1,
							migrating_slot: -1,
						},
					],
				},
			}
		},
	},
	// 删除分片
	{
		url: `/api/v1/namespaces/${NAMESPACE}/clusters/${CLUSTER}/shards/${SHARD}`,
		method: 'DELETE',
		timeout: 800,
		response: () => ({ data: 'ok' }),
	},
] as MockMethod[]
