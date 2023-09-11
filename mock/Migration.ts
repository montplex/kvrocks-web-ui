import { MockMethod } from 'vite-plugin-mock'
import { NAMESPACE, CLUSTER } from '../src/types/const'

export default [
	// 迁移槽和数据 | 仅迁移插槽
	{
		url: `/api/v1/namespaces/${NAMESPACE}/clusters/${CLUSTER}/shards/migration/slot_data`,
		method: 'post',
		response: () => ({ data: 'ok' }),
	},
] as MockMethod[]
