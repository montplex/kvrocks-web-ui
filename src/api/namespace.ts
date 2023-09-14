import { http } from '~@/composables/http'

import type {
	ClusterRes,
	Body,
	ShardRes,
	ShardResList,
	ListNode,
	MigrateBody,
} from '~@/types/cluster'
import { useRequest } from 'vue-request'

type Err = { error: { message: string } }
type Create = { data: string }
let url = ''

/**
 * Create Namespace 创建命名空间
 * @param namespace
 * @returns
 */
export const createNamespace = (namespace: string) => {
	return http.post<Create>({
		url: '/v1/namespaces',
		data: { namespace },
	})
}

type RES<T> = { data: T }
type NamespaceList = RES<{ namespaces: string[] }>

/** List Namespace 列表命名空间 */
export const getNamespaceList = () => {
	return http.get<NamespaceList>({
		url: '/v1/namespaces',
	})
}

/** Delete Namespace 删除命名空间 */
export const delNamespace = (namespace: string) => {
	/* if (process.env.NODE_ENV === 'production') {
		url =
	} else {
		url = `/v1/namespaces/namespace_1`
	} */
	return http.get<{ data: 'ok' }>({
		url: `/v1/namespaces/${namespace}`,
	})
}

/**--------------------集群 */

type ClusterBody = {
	name: string
	nodes: string[]
	replica: number
	password: string
}

/** Create Cluster 创建集群 */
export const createCluster = (namespace: string, data: ClusterBody) => {
	/* 	if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters`
	} else {
		url = `/v1/namespaces/namespace_1/clusters`
	}
 */
	type TCreate = {
		error: {
			message: string
		}
		data?: null | string
	}

	return http.post<TCreate>({
		url: `/v1/namespaces/${namespace}/clusters`,
		data,
	})
}

/** List Cluster 列表群集 */
export const getClusterList = (namespace: string) => {
	/* if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters`
	} else {
		url = `/v1/namespaces/namespace_1/clusters`
	} */

	return http.get<RES<{ clusters: string[] }>>({
		url: `/v1/namespaces/${namespace}/clusters`,
	})
}

export const getClusters = (namespace: string) => {
	const { data, loading, refresh, error } = useRequest(() =>
		http.get<RES<{ clusters: string[] }>>({
			url: `/v1/namespaces/${namespace}/clusters`,
		}),
	)
	let list: { name: string; selected: boolean }[] | undefined
	list = data.value?.data?.clusters.map((it) => ({
		name: it,
		selected: false,
	}))

	return {
		data: list,
		loading,
		error,
		refresh,
	}
}

/** Get Cluster 获取群集 */
export const getCluster = (namespace: string, cluster: string) => {
	/* if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters/${cluster}`
	} else {
		url = `/v1/namespaces/namespace_1/clusters/cluster_1`
	} */
	return http.get<ClusterRes>({
		url: `/v1/namespaces/${namespace}/clusters/${cluster}`,
	})
}

/** Delete Cluster 删除集群 */
export const delCluster = (namespace: string, cluster: string) => {
	/* if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters/${cluster}`
	} else {
		url = `/v1/namespaces/namespace_1/clusters/cluster_1`
	}
 */
	return http.delete<{ data: 'ok' }>({
		url: `/v1/namespaces/${namespace}/clusters/${cluster}`,
	})
}

/**--------------------分片 */
type ShardBody = {
	nodes: string[]
	password: string
}
/** Create Shard 创建分片 */
export const createShard = (
	namespace: string,
	cluster: string,
	body: ShardBody,
) => {
	/* 	if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters/${cluster}/shards`
	} else {
		url = `/v1/namespaces/namespace_1/clusters/cluster_1/shards`
	}
 */
	return http.post<{ data: 'ok' }>({
		url: `/v1/namespaces/${namespace}/clusters/${cluster}/shards`,
		data: body,
	})
}

type ShardParams = Required<Pick<Body, 'namespace' | 'cluster' | 'shard'>>

/** Get Shard 获取分片 */
export const getShard = (data: ShardParams) => {
	const { namespace, cluster, shard } = data

	if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters/${cluster}/shards/${shard}`
	} else {
		url = `/v1/namespaces/namespace_1/clusters/cluster_1/shards/shard_1`
	}

	return http.get<ShardRes>({
		url,
	})
}

/** List Shard 列表分片 */
export const getListShard = (data: Pick<Body, 'namespace' | 'cluster'>) => {
	const { namespace, cluster } = data
	if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters/${cluster}/shards`
	} else {
		url = `/v1/namespaces/namespace_1/clusters/cluster_1/shards`
	}

	return http.get<ShardResList>({
		url,
	})
}

/** Delete Shard 删除分片 */
export const delShard = (data: ShardParams) => {
	const { namespace, cluster, shard } = data
	// if (process.env.NODE_ENV === 'production') {
	// 	url = `/v1/namespaces/${namespace}/clusters/${cluster}/shards/${shard}`
	// } else {
	// 	url = `/v1/namespaces/namespace_1/clusters/cluster_1/shards/shard_1`
	// }
	return http.delete<{ data: 'ok' }>({
		url: `/v1/namespaces/${namespace}/clusters/${cluster}/shards/${shard}`,
	})
}

/**-----------------Node */

type NodeBody = {
	addr: string
	role: string
	password: string
}

/** Create Node 创建节点 */
export const createNode = (path: ShardParams & { data: NodeBody }) => {
	const { namespace, cluster, shard } = path
	/* if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters/${cluster}/shards/${shard}/nodes`
	} else {
		url = `/v1/namespaces/namespace_1/clusters/cluster_1/shards/shard_1/nodes`
	} */
	return http.post<{ data: 'created' } & Err>({
		url: `/v1/namespaces/${namespace}/clusters/${cluster}/shards/${shard}/nodes`,
		data: path.data,
	})
}

/** List Node 列表节点 */
export const getListNode = (data: ShardParams) => {
	const { namespace, cluster, shard } = data
	return http.get<ListNode>({
		url: `/v1/namespaces/namespace_1/clusters/cluster_1/shards/shard_1/nodes`,
	})
}

/** Delete Node 删除节点 */
export const delNode = (data: Body) => {
	const { namespace, cluster, shard, nodeID } = data
	return http.delete<{ data: 'ok' }>({
		url: `/v1/namespaces/${namespace}/clusters/${cluster}/shards/${shard}/nodes/${nodeID}`,
	})
}

/* 迁移插槽和数据步骤: 1)制定计划 -> 2)迁移数据 -> 3)添加从节点
	1. 需要准备好迁移的的节点，而且保证已经加入到集群
	2. 准备迁移插槽和数据
	3. 制定插槽迁移计划,迁移到新的节点中: 假如我们现在有三个节点，又加入一个新节点，我们怎么样把插槽进行一个规划？
		- 1. 选择一个节点，将这个节点的插槽迁移到新的节点中
*/

/** Migrate  迁移 */
export const MigrateSlotData = (
	data: Pick<Body, 'namespace' | 'cluster'> & { data: MigrateBody },
) => {
	const { namespace, cluster } = data
	return http.post<{ data: 'ok' }>({
		url: `/v1/namespaces/${namespace}/clusters/${cluster}/shards/migration/slot_data`,
		data: data.data,
	})
}
