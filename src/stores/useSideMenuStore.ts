import { h } from 'vue'
import { defineStore } from 'pinia'

const generator = (routerMap: any) => {
	return routerMap.map((item: any) => {
		const { title, hideInMenu, icon } = item.meta || {}
		// @unocss-include
		const currentRouter: any = {
			label: title,
			key: item.path,
			icon: icon ? h('i', { class: icon }) : null,
			// router警告组件是响应式时可使用 shallowRef 包裹
			// https://cn.vuejs.org/api/reactivity-advanced.html#shallowref
		}

		item.redirect && (currentRouter.redirect = item.redirect)

		if (item.children && item.children.length > 0) {
			currentRouter.children = generator(item.children)
		}
		return hideInMenu ? null : currentRouter
	})
}

const emptyMenu: any[] = [{ label: '', key: '' }]

const menuMap = new Map()

export default defineStore('SideMenu', {
	state: () => ({ menus: emptyMenu }),
	getters: {
		onlyMenu(): boolean {
			return (
				// @ts-ignore
				this.menus.length > 1 ||
				(this.menus[0] &&
					this.menus[0].children &&
					this.menus[0].children.length)
			)
		},
	},
	actions: {
		changeSide(side: any) {
			if (!menuMap.has(side.path)) {
				menuMap.set(side.path, generator(side.children) || [])
			}

			this.menus = menuMap.get(side.path)
		},
	},
})
