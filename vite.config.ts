import ToYi from './presets'
import { defineConfig, loadEnv, ConfigEnv } from 'vite'

// @see: https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
	const root = process.cwd()
	const env = loadEnv(mode, root)
	return {
		plugins: [ToYi()],
		server: {
			// host: '0.0.0.0',
			open: true,
			cors: true,
			proxy: {
				'/api': {
					target: env.VITE_API_URL,
					secure: true,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
	}
})
