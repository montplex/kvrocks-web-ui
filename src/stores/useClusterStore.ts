import { defineStore } from 'pinia'

interface State {
	nameSpaceList: string[]
	clusters: { name: string; selected: boolean }[]
	current: string[]
	loading: boolean
}
export default defineStore('cluster', {
	state: (): State => ({
		nameSpaceList: [],
		clusters: [],
		current: [],
		loading: false,
	}),
	actions: {
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
			console.log(index, name)
			this.clusters.forEach((item) => (item.selected = false))
			this.clusters[index].selected = true
		},
		setLoading(type: boolean) {
			this.loading = type
		},
	},
})
