<template>
	<div class="flex-1 px-6">
		<h3 class="text-ba py-4 font-semibold">{{ cluster }}</h3>
		<div class="flex flex-row-reverse gap-4 pb-6">
			<!-- <a-button danger ghost :icon="h(DeleteOutlined)" class="flex_cc" @click="delOpen = true">Delete Cluster</a-button> -->
			<a-tooltip title="Delete Cluster">
				<a-button
					type="primary"
					danger
					:icon="h(DeleteOutlined)"
					class="flex_cc"
				/>
			</a-tooltip>
			<a-button type="primary" class="flex_cc gap-2" @click="hcMigrateSlot">
				<template #icon><IconMigration class="h-4 w-4" /></template>
				Migrate Slot
			</a-button>
			<a-button type="primary" class="flex_cc gap-2" @click="open = true">
				<template #icon><IconShard class="h-4 w-4" /></template>
				Add Shard</a-button
			>
		</div>
		<a-table
			:columns="SHARDS_COLUMNS"
			:data-source="shards?.shards"
			:pagination="false"
		>
			<template #expandColumnTitle><span>Nodes</span></template>
			<template #bodyCell="{ column, text, record }">
				<template v-if="column.dataIndex === 'slot_ranges'">
					<ATag v-for="tag in text" :key="tag" color="green"> {{ tag }} </ATag>
				</template>
				<template v-if="column.key === 'actions'">
					<a-button type="link" @click="hcCreateNode(record)"
						>Create Node
					</a-button>
					<!-- <a-popconfirm title="Sure to delete this Shard?" @confirm="hcDeleteShard(record as any)"> -->
					<a-button type="link" danger @click="hcDeleteShard(record as any)"
						>Delete</a-button
					>
					<!-- </a-popconfirm> -->
				</template>
			</template>
			<template #expandedRowRender="{ record }">
				<a-table
					v-if="record.nodes.length"
					:columns="NODES_COLUMNS"
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
								@confirm="deleteNodes(record as any)"
							>
								<a-button type="link" danger>Delete</a-button>
							</a-popconfirm>
						</template>
					</template>
				</a-table>
			</template>
		</a-table>
	</div>
	<ModalFrom v-model:model-value="open" type="shard" @ShardCreated="submitOk" />
	<ModalDeleteCluster
		v-model:model-value="delOpen"
		:name="cluster"
		@onDel="onDelCluster"
	/>
	<ModalAddNode ref="nodeRef" @onOk="createNodeOnOk" />
	<ModalMigrateSlot ref="migrateRef" @onOk="submitOk" />
</template>

<script lang="ts" setup>
import {
	PlusCircleOutlined,
	CopyOutlined,
	CheckOutlined,
	DeleteOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons-vue'

import { Modal, message } from 'ant-design-vue'
import type { Cluster, ClusterRes, Shard, Node } from '#/cluster'
import { SHARDS_COLUMNS, NODES_COLUMNS } from '~@/composables/constant/const'
import { h } from 'vue'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const namespace = route.params.namespace as string
const cluster = ref(route.query.cluster as string)

const store = useClusterStore()
const base = baseStore()

const open = ref(false)

const shards = ref<Cluster>()
const delOpen = ref(false)
const nodeRef = ref()
const migrateRef = ref()

watch(
	() => store.current,
	(val) => {
		if (val) {
			cluster.value = val[0]
			clusterInit(val[0])
		}
	},
	{ immediate: true },
)

async function clusterInit(cluster: string) {
	base.setLoading(true)
	http
		.get<ClusterRes>({ url: `/v1/namespaces/${namespace}/clusters/${cluster}` })
		.then((res) => {
			const list = res.data?.cluster.shards
			if (list?.length) {
				list.map((item: any, idx: number) => {
					item.key = idx
					item.nodes.map((node: any, index: number) => {
						node.key = index
						node.shard = idx
					})
				})
				shards.value = { ...res.data.cluster, shards: list }
			}
		})
		.finally(() => base.setLoading(false))
}

/** 删除集群 */
const onDelCluster = async (name: string) => {
	base.setLoading(true)
	delCluster(namespace, cluster.value)
		.then((res) => {
			if (res.data === 'ok') {
				message.success('delete success')
				const index = store.clusters.findIndex(
					(item) => item.name === cluster.value,
				)
				store.clusters?.splice(index, 1)
				store.setCurrent(store.clusters[0]?.name)
				delOpen.value = false
			}
		})
		.finally(() => base.setLoading(false))
}

const hcMigrateSlot = () => (migrateRef.value.open = true)

const { copy, copied, isSupported } = useClipboard()

const submitOk = () => clusterInit(cluster.value)

const deleteNodes = (e: Node) => {
	const args = {
		namespace,
		cluster: cluster.value,
		shard: e.shard,
		nodeID: e.id,
	}

	delNode(args)
		.then((res) => {
			if (res.data === 'ok') {
				message.success('delete success')
				clusterInit(cluster.value)
			}
		})
		.catch((err) => {
			console.log(err)
		})
	// const list = shards.value?.shards.map((item) => {
	// 	return {
	// 		...item,
	// 		nodes: item.nodes.filter((node) => node.id !== column.id),
	// 	}
	// })
	// shards.value = { ...shards.value, shards: list } as Cluster
}

const hcCreateNode = (e: any) => {
	nodeRef.value.open = true
	nodeRef.value.shard = e.key
}

const createNodeOnOk = () => nodeRef.value.onOk()

const hcDeleteShard = (e: Shard) => {
	if (e.nodes?.length) {
		Modal.warning({
			title: 'Warning',
			content: 'need to delete all slots before removing shard.',
		})
		return
	}

	Modal.confirm({
		title: 'Are you sure delete this Shard?',
		icon: h(ExclamationCircleOutlined),
		okText: 'Delete',
		okType: 'danger',
		cancelText: 'No',
		onOk() {
			message.loading({ content: 'deletin...', key: 'delShard' })
			delShard({
				namespace,
				cluster: cluster.value,
				shard: e.key as number,
			})
				.then((res) => {
					if (res.data === 'ok') {
						message.success({
							content: 'delete success',
							key: 'delShard',
							duration: 2,
						})
					}
				})
				.catch((err) => {
					console.log(err)
				})
		},
	})
}
</script>
