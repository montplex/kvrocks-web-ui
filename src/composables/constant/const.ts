export const NAMESPACE = 'namespace_1'
export const CLUSTER = 'cluster_1'
export const SHARD = 'shard_1'
export const NODE_ID = 'nodeid_1'

export const SHARDS_COLUMNS: any = [
	{
		title: 'Shard Index',
		dataIndex: 'key',
		key: 'key',
	},

	{
		title: 'Slot Ranges',
		dataIndex: 'slot_ranges',
		key: 'slot_ranges',
	},
	// {
	// 	title: 'Import Slot',
	// 	dataIndex: 'import_slot',
	// 	key: 'import_slot',
	// },
	// {
	// 	title: 'Migrating Slot',
	// 	dataIndex: 'migrating_slot',
	// 	key: 'migrating_slot',
	// },
	// { title: 'Slot Info', key: 'slot_info', align: 'center' },
	{ title: 'Action', key: 'actions', align: 'center' },
]

export const NODES_COLUMNS: any = [
	{
		title: 'Address',
		dataIndex: 'addr',
		key: 'addr',
	},
	{
		title: 'Role',
		dataIndex: 'role',
		key: 'role',
	},
	{
		title: 'Password',
		dataIndex: 'password',
		key: 'password',
		align: 'center',
	},
	{
		title: 'Master Auth',
		dataIndex: 'master_auth',
		key: 'master_auth',
		align: 'center',
	},
	{ title: 'Created Date', dataIndex: 'created_at', key: 'created_at' },
	{ title: 'Action', key: 'actions' },
]
