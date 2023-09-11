<template>
	<div class="tabs px-6">
		<a-tabs
			v-model:activeKey="$route.path"
			:hide-add="true"
			type="editable-card"
			@edit="delTabs"
			@tab-click="(key: any) => handleTabClick(key.toString())"
		>
			<a-tab-pane
				v-for="item of tabsStore.tagList"
				:key="item.path"
				:tab="item.meta?.title as string"
				:closable="item.path !== '/name-space'"
			>
			</a-tab-pane>
			<!-- 右侧按钮 -->
			<template #rightExtra>
				<a-dropdown id="tab-menus" :trigger="['click', 'hover']">
					<IconMagic class="mr-8"></IconMagic>
					<template #overlay>
						<a-menu>
							<a-menu-item @click="tabsStore.closeCurrent(route.path)">
								<template #icon>
									<PlusOutlined />
								</template>
								<template #default>关闭当前</template>
							</a-menu-item>
							<a-menu-item @click="tabsStore.closeOther(route.path)">
								<template #icon>
									<ClearOutlined />
								</template>
								<template #default>关闭其他</template>
							</a-menu-item>
							<a-menu-item @click="tabsStore.closeAll">
								<template #icon>
									<MinusOutlined />
								</template>
								<template #default>关闭全部</template>
							</a-menu-item>
						</a-menu>
					</template>
				</a-dropdown>
			</template>
		</a-tabs>
	</div>
</template>

<script setup lang="ts" name="NavTab">
import {
	MinusOutlined,
	ClearOutlined,
	PlusOutlined,
} from '@ant-design/icons-vue'
import type { RouteRecordRaw } from 'vue-router'
import useTabsStore from '~@/stores/useTabsStore'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

tabsStore.reset()

// 监听路由变化
watch(
	() => route.path,
	() => {
		nextTick(() => {
			handleRouteChange()
		})
	},
	{ immediate: true },
)

// 路由发生改变触发
const handleRouteChange = () => {
	const item = { ...route } as unknown as RouteRecordRaw
	tabsStore.addTagItem(item)
	tabsStore.addCacheItem(item)
	console.log('路由对象', item)
	console.log('tagList', tabsStore.tagList)
	console.log('cacheList', tabsStore.cacheList)
}

// 点击页签
const handleTabClick = (key: string) => {
	router.push({ path: key })
}

const delTabs = (e: any) => {
	console.log('del', e)
	tabsStore.closeCurrent(e)
}
</script>

<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
	margin-bottom: 0;
	&::before {
		border-bottom: none;
	}
	.ant-tabs-tab {
		border-bottom-color: transparent !important;
		svg {
			width: 0;
			transition: all 0.15s;
		}
		.ant-tabs-tab-btn {
			text-shadow: none !important;
			font-weight: 500 !important;
		}
		&:hover {
			.ant-tabs-tab-remove {
				width: 18px;
				height: 18px;
				border-radius: 50%;
				background-color: #e5efff;
				svg {
					fill: #1677ff;
					width: 1.2em;
				}
			}
		}
	}
}
.tabs {
	padding-top: 5px;
	background: white;
}
</style>
