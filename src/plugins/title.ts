import { router } from './router'

useTitle(
	() => {
		const { path } = router.currentRoute.value
		if (path === '/') {
			return `${import.meta.env.VITE_APP_TITLE} | console`
		}
		const path_name = path.split('/').pop()
		return `Kvrocks · ${path_name}`
	},
	{
		titleTemplate: ` %s`,
	},
)
