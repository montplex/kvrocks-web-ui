import { defineStore } from 'pinia'
import { ref } from 'vue'

const storeSetup = () => {
	const loading = ref(false)
	const setLoading = (type: boolean) => {
		loading.value = type
	}

	return {
		loading,
		setLoading,
	}
}

export default defineStore('base', storeSetup, { persist: false })
