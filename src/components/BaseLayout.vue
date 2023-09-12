<template>
	<a-layout class="h-screen">
		<a-layout-sider
			v-model:collapsed="collapsed"
			:trigger="null"
			collapsible
			theme="dark"
			width="220"
			class="!px-2"
		>
			<div
				class="mt-2 h-[56px] flex items-center gap-3 px-3"
				:class="{ 'justify-center': collapsed }"
				@click="$router.push('/')"
			>
				<img class="h-10 w-10" src="/logo.svg" alt="Apache Kvrocks" />
				<h3
					v-if="!collapsed"
					class="text-xl font-semibold text-white hover:text-[#ff5318] hover:opacity-90"
				>
					Kvrocks
				</h3>
			</div>
			<a-menu
				v-model:selectedKeys="selectedKeys"
				class="mt-6"
				theme="dark"
				mode="inline"
				:border="false"
				style="border-inline-end: none"
			>
				<a-menu-item key="1" :icon="h(NameSpace)" @click="$router.push('/')">
					<span>Namespace</span>
				</a-menu-item>
			</a-menu>
		</a-layout-sider>
		<a-layout class="w-full overflow-x-hidden">
			<BaseLayoutHeader v-model:modelValue="collapsed" />
			<MyTabs />
			<a-layout-content
				class="shadow_card mx-6 my-10 h-full rounded-lg bg-[#f3f3f3] bg-white !overflow-x-hidden"
			>
				<router-view v-slot="{ Component, route }">
					<transition name="fade" mode="out-in">
						<div :key="route.matched[1].path" class="h-full w-full">
							<keep-alive :include="tabsStore.cacheList as string[]">
								<component :is="Component" />
							</keep-alive>
						</div>
					</transition>
				</router-view>
			</a-layout-content>
		</a-layout>
	</a-layout>
</template>
<script lang="ts" setup>
import { h } from 'vue'
import NameSpace from './Icon/NameSpace.vue'
const selectedKeys = ref<string[]>(['1'])
const collapsed = ref<boolean>(true)
const tabsStore = useTabsStore()
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
