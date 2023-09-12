<template>
	<div class="flex-1 px-6">
		<div>
			<h3 class="text-ba py-4 font-semibold">{{ cluster }}</h3>
			<div class="flex flex-row-reverse gap-4 pb-6">
				<a-button
					danger
					ghost
					:icon="h(DeleteOutlined)"
					class="flex_cc"
					@click="hcDelCluster"
					>Delete Cluster</a-button
				>
				<a-button
					type="primary"
					ghost
					:icon="h(PlusCircleOutlined)"
					class="flex_cc"
					@click="open = true"
					>Create Shard</a-button
				>
			</div>

			<a-table
				:loading="loading"
				:columns="columns"
				:data-source="shards?.shards"
				:pagination="false"
			>
				<template #expandColumnTitle><span>Nodes</span></template>
				<template #bodyCell="{ column, text }">
					<template v-if="column.dataIndex === 'slot_ranges'">
						<a-tag
							v-for="tag in text"
							:key="tag"
							:color="
								tag === 'loser'
									? 'volcano'
									: tag.length > 5
									? 'geekblue'
									: 'green'
							"
						>
							{{ tag }}
						</a-tag>
					</template>
				</template>
				<template #expandedRowRender="{ record }">
					<a-table
						:columns="nodesColumns"
						:data-source="record.nodes"
						:pagination="false"
					>
						<template #bodyCell="{ column, text, record }">
							<template v-if="column.dataIndex === 'created_at'">
								<p>{{ dayjs(text).format('YYYY-MM-DD HH:mm:ss') }}</p>
							</template>
							<template v-if="column.dataIndex === 'addr'">
								<a class="text-main">{{ text }}</a>
							</template>
							<template v-if="column.dataIndex === 'password'">
								<a v-if="!text"> - </a>
								<span v-else class="text-main">
									<p class="flex_cc gap-2">
										<i class="h-[14px]">***********</i>
										<ATooltip
											v-if="isSupported"
											:title="copied ? 'Copied' : 'Copy'"
										>
											<div @click="copy(text)">
												<CheckOutlined v-if="copied" />
												<CopyOutlined v-else />
											</div>
										</ATooltip>
									</p>
								</span>
							</template>
							<template v-if="column.dataIndex === 'master_auth'">
								<a> {{ text || '-' }}</a>
							</template>
							<template v-if="column.key === 'actions'">
								<a-popconfirm
									title="Sure to delete this node?"
									@confirm="deleteNodes(record)"
								>
									<span class="text-[#ff4d4f] hover:opacity-80">Delete</span>
								</a-popconfirm>
								<!-- <div @click="deleteNodes(column)" class="text-[#ff4d4f] hover:opacity-80">Delete</div> -->
							</template>
						</template>
					</a-table>
				</template>
			</a-table>
		</div>
		<!-- <div v-else> choose cluster!</div> -->
	</div>
	<ModalFrom
		v-model:model-value="open"
		type="shard"
		@ShardCreated="shardCreatedOk"
	/>
</template>

<script lang="ts" setup>
import {
	PlusCircleOutlined,
	CopyOutlined,
	CheckOutlined,
	DeleteOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import { message, type FormInstance, Modal } from 'ant-design-vue'
import type { Cluster, Node } from '#/cluster'
import { createVNode, h } from 'vue'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const namespace = route.params.namespace as string
const cluster = ref(route.query.cluster as string)
const store = useClusterStore()

const open = ref(false)
const loading = ref(true)
const shards = ref<Cluster>()

watch(
	() => route.query.cluster,
	(val) => {
		if (val) {
			cluster.value = val as string
			hcClusterItem(val as string)
		}
	},
)

onMounted(async () => {
	loading.value = true
	if (!cluster.value) {
		cluster.value = store.clusterList[0]
		hcClusterItem(cluster.value)
	}
	loading.value = false
})

const initNodes = async () => {
	loading.value = true
	const res = await getListNode({
		namespace: namespace,
		cluster: 'cluster',
		shard: 'shard',
	})
	// nodes.value = res.data.nodes
	loading.value = false
}

const hcClusterItem = async (cluster: string) => {
	const res = await getCluster(namespace, cluster)
	const list = res.data.cluster.shards
	list.map((item: any, idx: number) => {
		item.key = idx + 1
		item.nodes.map((node: any, index: number) => (node.key = index + 1))
	})
	shards.value = { ...res.data.cluster, shards: list }
}

/** 删除分片  */
const hcDelShard = async (cluster: string, shard: string) => {
	loading.value = true
	const res = await delShard({ namespace, cluster, shard })
	if (res.data === 'ok') {
		message.success('delete success')
		loading.value = false
	}
}

/** 删除集群 */
const hcDelCluster = async () => {
	Modal.confirm({
		title: 'Delete these cluster?',
		icon: createVNode(ExclamationCircleOutlined),

		okText: 'Delete',
		okType: 'danger',
		onOk() {
			loading.value = true
			delCluster(namespace, cluster.value)
				.then((res) => {
					if (res.data === 'ok') {
						message.success('delete success')
						const index = store.clusterList.indexOf(cluster.value) as number
						store.clusterList?.splice(index, 1)
						router.push({
							name: 'Nodes',
							query: { cluster: store.clusterList[0] },
						})
					}
				})
				.finally(() => (loading.value = false))
		},
	})
}

const columns = [
	{
		title: 'Slot Ranges',
		dataIndex: 'slot_ranges',
		key: 'slot_ranges',
	},
	{
		title: 'Import Slot',
		dataIndex: 'import_slot',
		key: 'import_slot',
	},
	{
		title: 'Migrating Slot',
		dataIndex: 'migrating_slot',
		key: 'migrating_slot',
	},
]

const nodesColumns = [
	// {
	// 	title: 'ID',
	// 	dataIndex: 'id',
	// },
	{
		title: 'Addr',
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

const { copy, copied, isSupported } = useClipboard()

const shardCreatedOk = () => {
	console.log('shardCreatedOk')
}

const deleteNodes = (column: any) => {
	const list = shards.value?.shards.map((item) => {
		return {
			...item,
			nodes: item.nodes.filter((node) => node.id !== column.id),
		}
	})
	shards.value = { ...shards.value, shards: list } as Cluster
}

// console.log(removeNodeById(arr,'1234'))
</script>
