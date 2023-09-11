export interface Body {
	shard: string
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
