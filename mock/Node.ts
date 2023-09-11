import { MockMethod } from 'vite-plugin-mock'
import { NAMESPACE, CLUSTER, SHARD, NODE_ID } from '../src/types/const'

export default [
	// 创建节点
	{
		url: `/api/v1/namespaces/${NAMESPACE}/clusters/${CLUSTER}/shards/${SHARD}/nodes`,
		method: 'post',
		timeout: 600,
		response: {
			data: 'created',
		},
	},
	// 列表节点
	{
		url: `/api/v1/namespaces/${NAMESPACE}/clusters/${CLUSTER}/shards/${SHARD}/nodes`,
		method: 'get',
		response: () => {
			return {
				data: {
					nodes: [
						{
							id: 'pxpE1JSBJcqicuwc95zqTPTj5rB7YtfvpociyH8C',
							addr: '127.0.0.1:6666',
							role: 'master',
							password: '',
							created_at: 1686101693,
						},
						{
							id: 'O0JKq1Hp9FtI3dJTU3MigWjjZJzPtduoDODX0OAY',
							addr: '127.0.0.1:6667',
							role: 'slave',
							password: '',
							created_at: 1686102057,
						},
					],
				},
			}
		},
	},
	// 删除分片
	{
		url: `/api/v1/namespaces/${NAMESPACE}/clusters/${CLUSTER}/shards/${SHARD}/nodes/${NODE_ID}`,
		method: 'DELETE',
		timeout: 800,
		response: () => ({ data: 'ok' }),
	},
] as MockMethod[]
