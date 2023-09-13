import { createRouter, createWebHistory } from 'vue-router'
import { RouteRecordRaw } from 'vue-router'
import Layout from '~@/components/BaseLayout.vue'
import NameSpace from '~@/pages/index.vue'

// @unocss-include
const routes: RouteRecordRaw[] = [
	{
		path: '',
		component: Layout,
		redirect: '/name-space',
		children: [
			{
				path: '/name-space',
				component: NameSpace,
				name: 'NameSpace',
				meta: {
					title: 'NameSpace',
					icon: 'icon-dashboard',
					affix: true,
					svgIcon: 'menu-home',
				},
			},
			{
				path: '/:namespace',
				name: 'Clusters',
				component: () => import('~@/pages/clusters.vue'),
				beforeEnter: (to, from) => {
					to.meta.title = to.params.namespace
				},
				redirect: { name: 'Nodes' },
				meta: {
					title: 'Clusters',
				},
				children: [
					{
						path: 'cluster',
						component: () => import('~@/pages/nodes.vue'),
						name: 'Nodes',
						beforeEnter: (to, from) => {
							to.meta.title = to.params.namespace
						},
					},
				],
			},
		],
	},
	{
		path: '/404',
		component: () => import('~@/pages/404.vue'),
	},
	{
		path: '/:pathMatch(.*)',
		redirect: '/404',
	},
]

export const router = createRouter({
	history: createWebHistory(),
	routes: routes,
})
export default router
