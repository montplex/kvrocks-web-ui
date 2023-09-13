import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '~@/plugins/router'
import type { RouteRecordRaw, RouteRecordName } from 'vue-router'

const storeSetup = () => {
	const tagList = ref<RouteRecordRaw[]>([]) // 保存页签tab的数组
	const cacheList = ref<RouteRecordName[]>([]) // keep-alive缓存的数组, 元素是组件名

	// 添加一个页签, 如果当前路由已经打开, 则不再重复添加
	const addTagItem = (item: RouteRecordRaw) => {
		if (tagList.value.some((i) => i.path === item.path)) return
		if (item.meta?.affix ?? true) {
			tagList.value.push(item)
		}
	}

	// 删除一个页签
	const deleteTagItem = (path: string) => {
		console.log('arr', path)
		const index = tagList.value.findIndex(
			(item) => item.path === path && !item.meta?.affix,
		)
		console.log(index, 'index')
		if (index >= 0) {
			const item = tagList.value[index]
			const isActive =
				router.currentRoute.value.path === tagList.value[index]['path']
			tagList.value.splice(index, 1)
			if (isActive) {
				router.replace({
					path: tagList.value[tagList.value.length - 1]['path'],
				})
			}
		}
	}

	// 清空页签
	const clearTagList = () => {
		// const arr = tagList.value.filter((item) => item.meta?.affix ?? false)
		// const hasNameSpace = tagList.value.some((it) => it.name === 'NameSpace')
		const home = [
			{
				path: '/name-space',
				name: 'NameSpace',
				meta: {
					title: 'NameSpace',
					affix: true,
					keepAlive: true,
				},
			},
		] as any[]

		tagList.value = [...home]
	}

	// 添加缓存页
	const addCacheItem = (item: RouteRecordRaw) => {
		if (item.name) {
			if (cacheList.value.includes(item.name)) return
			if (
				item.meta?.keepAlive ||
				router.currentRoute.value.name === 'NameSpace'
			) {
				cacheList.value.push(item.name)
			}
		}
	}

	// 删除一个缓存页
	const deleteCacheItem = (name: RouteRecordName) => {
		const index = cacheList.value.findIndex((item) => item === name)
		if (index >= 0) {
			cacheList.value.splice(index, 1)
		}
	}

	// 清空缓存页
	const clearCacheList = () => {
		cacheList.value = []
	}

	// 关闭当前
	const closeCurrent = (path: string) => {
		console.log('path', path)
		deleteTagItem(path)
		const item = tagList.value.find((i) => i.path === path)
		if (item?.name) {
			deleteCacheItem(item.name)
		}
	}

	// 关闭其他
	const closeOther = (path: string) => {
		const arr = tagList.value.filter((i) => i.path !== path)
		arr.forEach((item) => {
			deleteTagItem(item.path)
			if (item?.name) {
				deleteCacheItem(item.name)
			}
		})
	}

	// 关闭全部
	const closeAll = () => {
		clearTagList()
		router.push({ path: '/' })
	}

	// 重置
	const reset = () => {
		clearTagList()
		clearCacheList()
	}

	return {
		tagList,
		cacheList,
		addTagItem,
		deleteTagItem,
		clearTagList,
		addCacheItem,
		deleteCacheItem,
		clearCacheList,
		closeCurrent,
		closeOther,
		closeAll,
		reset,
	}
}
export default defineStore('tabs', storeSetup, { persist: false })
