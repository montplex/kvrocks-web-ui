<template>
	<div class="">
		<div class="border-b border-light-400 px-6 py-4 text-t88">
			<div class="flex_c justify-between text-base font-semibold">
				<div class="">Clusters</div>
				<div v-if="store.clusters?.length">
					<a-tooltip title="Create Cluster">
						<a-button
							type="primary"
							:icon="h(PlusCircleOutlined)"
							class="flex_cc"
							@click="openShow"
						/>
					</a-tooltip>
				</div>
			</div>
			<div>
				<span class="opacity-70"
					>Namespace in {{ $route.params.namespace as string }}</span
				>
			</div>
		</div>
		<div class="_body h-full w-full">
			<a-spin :spinning="base.loading" class="mx-auto pt-60">
				<div v-if="store.clusters?.length" class="flex">
					<a-menu
						v-model:selectedKeys="store.current"
						style="width: 256px; height: 100%"
						mode="inline"
						class="min-h-max"
						@click="itemClick"
					>
						<a-menu-item
							v-for="it in store.clusters"
							:key="it.name"
							:title="it.name"
						>
							<template #icon>
								<IconClusterOutlineBadged v-if="it.selected" />
								<IconClusterLine v-else />
							</template>
							<div class="flex_c">
								<div class="flex-1 text-base">{{ it.name }}</div>
								<!-- <div @click.stop>
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
								</div> -->
							</div>
						</a-menu-item>
					</a-menu>
					<RouterView v-if="store.clusters" />
				</div>
				<a-empty
					v-if="!store.clusters?.length && !base.loading"
					:image-style="{ height: '80px' }"
					class="rounded-lg !m-0 !py-20"
				>
					<template #description>
						<span> The clusters in this namespace is empty. </span>
					</template>
					<a-button type="primary" @click="openShow">Create Now</a-button>
				</a-empty>
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
import { ref, h } from 'vue'

const route = useRoute()
const router = useRouter()
const namespace = ref(route.params.namespace as string)
const open = ref<boolean>(false)
const loading = ref<boolean>(true)

const store = useClusterStore()
const base = baseStore()
/* const current = ref<string[]>([store.clusterList[0]])
const select = ref<string[]>([store.clusters[0]?.name])

watch(
	() => route.query.cluster,
	(val) => {
		if (val) {
			current.value = [val as string]
		} else {
			console.log('val', val)
			current.value = [store.clusterList[0]]
		}
	},
)
*/

watch(
	() => route.params.namespace,
	(val) => {
		val && init(val as string)
	},
)

const openShow = () => {
	open.value = true
}

onMounted(() => init(route.params.namespace as string))
const init = (namespace: string) => {
	store.clusters = []
	base.setLoading(true)
	getClusterList(namespace)
		.then((res) => {
			if (res.data.clusters?.length) {
				const list = res.data.clusters.map((it) => ({
					name: it,
					selected: false,
				}))
				store.setClusters(list)
				store.setCurrent(
					(route.query.cluster as string) || res.data.clusters[0],
				)
			}
			base.setLoading(false)
		})
		.finally(() => base.setLoading(false))
}

const createdClusterOk = (name: string) => {
	store.clusters.unshift({ name, selected: false })
}

/* const hcClusterItem = async (e: any) => {
	router.push({ name: 'Nodes', query: { cluster: e.key } })
} */
const itemClick = async (e: any) => {
	store.setCurrent(e.key)
	router.push({ name: 'Nodes', query: { cluster: e.key } })
}
</script>
