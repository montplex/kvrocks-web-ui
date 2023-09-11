import { defineStore } from 'pinia'

interface State {
	nameSpaceList: string[]
	clusterList: string[]
}
export default defineStore('cluster', {
	state: (): State => ({
		nameSpaceList: [] as string[],
		clusterList: [] as any[],
	}),
	actions: {
		setClusterList(list: State['clusterList']) {
			this.clusterList = list
		},
		setNameSpaceList(list: string[]) {
			this.nameSpaceList = list
		},
		/* setClusterSelected(index: number) {
			// 先清空所有的
			this.clusterList.forEach((item) => {
				item.selected = false
			})
			// 再设置选中的
			this.clusterList[index].selected = true
		}, */
	},
})
