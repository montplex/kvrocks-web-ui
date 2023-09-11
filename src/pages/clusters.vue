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
					<a-menu
						v-model:selectedKeys="current"
						style="width: 256px; height: 100%"
						mode="inline"
						class="min-h-max"
						@click="hcClusterItem"
					>
						<a-menu-item
							v-for="menu in store.clusterList"
							:key="menu"
							:title="menu"
						>
							<template #icon>
								<IconClusterLine />
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
import { ref, h } from 'vue'

const route = useRoute()
const router = useRouter()
const namespace = route.params.namespace as string

const open = ref<boolean>(false)
const loading = ref<boolean>(true)
const type = ref<'cluster' | 'shard'>('cluster')
const store = useClusterStore()
const current = ref<string[]>([store.clusterList[0]])

watch(
	() => route.query.cluster,
	(val) => {
		if (val) {
			current.value = [val as string]
		} else {
			current.value = [store.clusterList[0]]
		}
	},
)

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

const hcClusterItem = async (e: any) => {
	router.push({ name: 'Nodes', query: { cluster: e.key } })
}
</script>
