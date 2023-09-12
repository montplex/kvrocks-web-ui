import { defineStore } from 'pinia'

interface State {
	nameSpaceList: string[]
	clusterList: string[]
	clusters: { name: string; selected: boolean }[]
	current: string[]
}
export default defineStore('cluster', {
	state: (): State => ({
		nameSpaceList: [],
		clusterList: [],
		clusters: [],
		current: [],
	}),
	actions: {
		setClusterList(list: State['clusterList']) {
			this.clusterList = list
		},
		setClusters(list: State['clusters']) {
			this.clusters = list
		},
		setNameSpaceList(list: string[]) {
			this.nameSpaceList = list
		},
		setCurrent(name: string) {
			this.current = [name]
			this.currentChange(name)
		},
		currentChange(name?: string) {
			const index = this.clusters.findIndex((item) => item.name === name)
			this.clusters.forEach((item) => (item.selected = false))
			this.clusters[index].selected = true
		},
	},
})
