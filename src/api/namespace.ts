import { http } from '~@/composables/http'
import { useRequest } from 'vue-request'
import { ClusterRes, Body, ShardRes, ShardResList, ListNode } from '#/cluster'

type Create = { data: string }
type Err = { error: { message: string } }
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
	if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}`
	} else {
		url = `/v1/namespaces/namespace_1`
	}
	return http.get<{ data: 'ok' }>({
		url,
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
	if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters`
	} else {
		url = `/v1/namespaces/namespace_1/clusters`
	}

	return http.post<Create>({
		url,
		data,
	})
}

/** List Cluster 列表群集 */
export const getClusterList = (namespace: string) => {
	if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters`
	} else {
		url = `/v1/namespaces/namespace_1/clusters`
	}

	return http.get<RES<{ clusters: string[] }>>({
		url,
	})
}

/** Get Cluster 获取群集 */
export const getCluster = (namespace: string, cluster: string) => {
	if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters/${cluster}`
	} else {
		url = `/v1/namespaces/namespace_1/clusters/cluster_1`
	}
	return http.get<ClusterRes>({ url })
}

/** Delete Cluster 删除集群 */
export const delCluster = (namespace: string, cluster: string) => {
	if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters/${cluster}`
	} else {
		url = `/v1/namespaces/namespace_1/clusters/cluster_1`
	}

	return http.delete<{ data: 'ok' }>({ url })
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
	if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters/${cluster}/shards`
	} else {
		url = `/v1/namespaces/namespace_1/clusters/cluster_1/shards`
	}

	return http.post<{ data: 'created' }>({
		url,
		data: body,
	})
}

type ShardParams = Pick<Body, 'namespace' | 'cluster' | 'shard'>

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
	if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters/${cluster}/shards/${shard}`
	} else {
		url = `/v1/namespaces/namespace_1/clusters/cluster_1/shards/shard_1`
	}
	return http.delete<{ data: 'ok' }>({
		url,
	})
}

/**-----------------Node */

type NodeBody = {
	addr: string
	role: string
	password: string
}

/** Create Node 创建节点 */
export const createNode = (body: ShardParams & { data: NodeBody }) => {
	const { namespace, cluster, shard } = body
	if (process.env.NODE_ENV === 'production') {
		url = `/v1/namespaces/${namespace}/clusters/${cluster}/shards/${shard}/nodes`
	} else {
		url = `/v1/namespaces/namespace_1/clusters/cluster_1/shards/shard_1/nodes`
	}
	return http.post<{ data: 'created' }>({
		url,
		data: body.data,
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
		url: `/v1/namespaces/namespace_1/clusters/cluster_1/shards/shard_1/nodes/nodeid_1`,
	})
}

type MigrateBody = {
	source: number
	target: number
	/** 迁移槽和数据 */
	slot?: number
	/**
	 * Migrate Slot Only 仅迁移插槽
	 * - 注意: 仅迁移插槽，并不会迁移数据。因此，在调用此 API 之前，必须确保数据已迁移。
	 * */
	slots?: string[]
}

/** Migrate  迁移 */
export const MigrateSlotData = (
	data: Pick<Body, 'namespace' | 'cluster'> & { data: MigrateBody },
) => {
	const { namespace, cluster } = data
	return http.post<{ data: 'created' }>({
		url: `/v1/namespaces/namespace_1/clusters/cluster_1/shards/migration/slot_data`,
		data: data.data,
	})
}
