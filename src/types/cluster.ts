export interface Body {
	shard: string | number
	namespace: string
	cluster: string
	nodeID: string
}
export interface ClusterRes {
	data: {
		cluster: Cluster
	}
}

export interface Cluster {
	name: string
	version: number
	shards: Shard[]
}

interface Shard {
	nodes: Node[]
	slot_ranges: string[]
	import_slot: number
	migrating_slot: number
}

export interface Node {
	id: string
	addr: string
	role: string
	password: string
	master_auth: string
	created_at: number
}

export interface ShardRes {
	data: {
		shard: Shard
	}
}

export interface ShardResList {
	data: {
		shards: Shard[]
	}
}

export interface ListNode {
	data: {
		nodes: Node[]
	}
}

export interface MigrateBody {
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
