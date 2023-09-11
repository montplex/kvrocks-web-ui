import { defineStore } from 'pinia'

export default defineStore('cluster', {
	state: () => ({
		nameSpaceList: [] as any[],
		clusterList: [] as any[],
	}),
	actions: {
		setClusterList(list) {
			this.clusterList = list
		},
		setNameSpaceList(list) {
			this.nameSpaceList = list
		},
	},
})
