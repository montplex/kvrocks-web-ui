<template>
	<div class="">
		<div class="border-b border-light-400 px-6 py-4 text-t88">
			<div class="flex_c justify-between text-base font-semibold">
				<div class="">Clusters</div>
				<div class="">
					<a-tooltip title="Create Cluster">
						<a-button
							type="primary"
							:icon="h(PlusCircleOutlined)"
							class="flex_cc"
							@click="clusterShow"
						/>
					</a-tooltip>
				</div>
			</div>
			<div>
				<span class="opacity-70">Namespace in {{ namespace }}</span>
			</div>
		</div>
		<div class="_body h-full w-full" style="">
			<a-spin :spinning="loading" class="pt-60">
				<div class="flex">
					<!-- v-model:selectedKeys="" -->
					<a-menu
						v-model:selectedKeys="current"
						style="width: 256px; height: 100%"
						mode="inline"
						class="min-h-max"
						@click="hcClusterItem"
					>
						<a-menu-item
							v-for="(menu, index) in store.clusterList"
							:key="menu"
							:title="menu"
						>
							<template #icon>
								<ClustersIcon />
							</template>
							<div class="flex_c">
								<span class="flex-1 text-base">{{ menu }}</span>
								<!-- <i @click.stop>
									<a-dropdown :trigger="['click']" :arrow="{ pointAtCenter: true }">
										<a-button type="text" class="text-main" @click.prevent>
											<template #icon>
												<MoreOutlined class="!text-lg !font-semibold" />
											</template>
										</a-button>
										<template #overlay>
											<a-menu>
												<a-menu-item @click="shardShow(menu)">
													<span class="0">Create Shard</span>
												</a-menu-item>
												<a-menu-item @click="hcDelCluster(menu, index)">
													<span class="text-red-400">Delete</span>
												</a-menu-item>
											</a-menu>
										</template>
									</a-dropdown>
								</i> -->
							</div>
						</a-menu-item>
					</a-menu>
					<RouterView />
					<!-- <div class="flex-1 px-6">
						<h3 class="py-4 font-semibold text-ba"> {{ currentCluster }}</h3>
						<div class="flex gap-4 pb-6 flex-row-reverse">
							<a-button danger ghost @click="hcDelCluster(currentCluster)" :icon="h(DeleteOutlined)"
					 class="flex_cc">Delete Cluster</a-button>
							<a-button type="primary" ghost @click="shardShow(currentCluster)" :icon="h(PlusCircleOutlined)"
					 class="flex_cc">Create Shard</a-button>

						</div>
						<a-table :columns="columns" :data-source="shards?.shards" :pagination="false">
							<template #expandColumnTitle><span>Nodes</span></template>
							<template #bodyCell="{ column, text }">
								<template v-if="column.dataIndex === 'slot_ranges'">
									<a-tag v-for="tag in text" :key="tag"
										:color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
										{{ tag }}
									</a-tag>
								</template>
							</template>
							<template #expandedRowRender="{ record }">
								<a-table :columns="nodesColumns" :data-source="record.nodes" :pagination="false">
									<template #bodyCell="{ column, text }">
										<template v-if="column.dataIndex === 'created_at'">
											<p>{{ dayjs(text).format('YYYY-MM-DD HH:mm:ss') }}</p>
										</template>
										<template v-if="column.dataIndex === 'addr'">
											<a class="text-main">{{ text }}</a>
										</template>
										<template v-if="column.dataIndex === 'password'">
											<a v-if="!text"> - </a>
											<span v-else class="text-main">
												<p class="flex_cc gap-2"><i class="h-[14px]">***********</i>
													<ATooltip v-if="isSupported" :title="copied ? 'Copied' : 'Copy'">
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
									</template>
								</a-table>
							</template>
						</a-table>


					</div> -->
				</div>
			</a-spin>
		</div>
	</div>

	<ModalFrom
		v-model:model-value="open"
		type="cluster"
		@cluster-created="createdClusterOk"
	/>
</template>
<script lang="ts" setup>
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { message, type FormInstance } from 'ant-design-vue'
import type { Cluster, Node } from '#/cluster'
import { ref, h } from 'vue'

const route = useRoute()
const router = useRouter()
const namespace = route.params.namespace as string

const open = ref(false)
const loading = ref(true)
const type = ref<'cluster' | 'shard'>('cluster')
const store = useClusterStore()
const current = ref<string[]>([store.clusterList[0]])

watch(
	() => route.query.cluster,
	(val) => {
		if (val) {
			current.value = [val as string]
		} else {
			current.value = store.clusterList[0]
		}
	},
)

const formState = reactive({
	name: '',
	replica: 1,
	password: '',
	nodes: [''],
})

onMounted(async () => {
	loading.value = true
	let res = await getClusterList(namespace)
	store.setClusterList(res.data.clusters)
	loading.value = false
})

const clusterShow = () => {
	type.value = 'cluster'
	open.value = true
}

const createdClusterOk = (name: string) => {
	store.clusterList.unshift(name)
}

/* const initNodes = async () => {
	modal_loading.value = true
	const res = await getListNode({ namespace: namespace, cluster: 'cluster', shard: 'shard' })
	nodes.value = res.data.nodes
	modal_loading.value = false
} */

const hcClusterItem = async (e: any) => {
	router.push({ name: 'Nodes', query: { cluster: e.key } })
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

/** 获取分片列表 */
const hcGetListShard = async (cluster: string) => {
	loading.value = true
	const res = await getListShard({ namespace, cluster })
	console.log(res.data.shards)
}
</script>
<style lang="scss"></style>
