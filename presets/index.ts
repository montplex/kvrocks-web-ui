import { utimes } from 'fs/promises'
import { isPackageExists } from 'local-pkg'
import { dirname, resolve } from 'path'
import { debounce } from 'perfect-debounce'
import { argv } from 'process'
import UnoCss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'

import {
	AntDesignVueResolver,
	VueUseComponentsResolver,
} from 'unplugin-vue-components/resolvers'

import Components from 'unplugin-vue-components/vite'

import { fileURLToPath } from 'url'
import { loadEnv } from 'vite'
import { AutoGenerateImports, vue3Presets } from 'vite-auto-import-resolvers'
import Compression from 'vite-plugin-compression'
import EnvTypes from 'vite-plugin-env-types'
import { viteMockServe as Mock } from 'vite-plugin-mock'
import Removelog from 'vite-plugin-removelog'
import Modules from 'vite-plugin-use-modules'
import VueDevTools from 'vite-plugin-vue-devtools'
import { warmup as Warmup } from 'vite-plugin-warmup'

import Legacy from '@vitejs/plugin-legacy'
import Vue from '@vitejs/plugin-vue'
import Jsx from '@vitejs/plugin-vue-jsx'

import Icons from 'unplugin-icons/vite'
import type { Plugin } from 'vite'
import type { ComponentResolver } from 'unplugin-vue-components/types'

export default function () {
	const env = useEnv()
	const safelist =
		'prose px-2 sm:px-0 md:prose-lg lg:prose-lg dark:prose-invert text-left w-screen prose-slate prose-img:rounded-xl prose-headings:underline prose-a:text-blue-600'
	const plugins = [
		// 兼容不支持 esmModule 的浏览器
		Legacy({
			targets: [
				'>= 0.25%',
				'last 2 versions',
				'not dead',
				'not ie <= 11',
				'Android >= 4.0',
				'iOS >= 8',
			],
		}),
		EnvTypes({
			dts: 'presets/types/env.d.ts',
		}),
		// https://github.com/bluwy/vite-plugin-warmup (依赖预热，加快渲染，未来可能会内置到 vite 中)
		Warmup({
			clientFiles: ['./src/**/*'],
		}),
		// 模块自动加载
		Modules({
			auto: true,
			target: 'src/plugins',
		}),
		// vue 官方插件，用来解析 sfc
		Vue({
			include: [/\.vue$/, /\.md$/],
		}),
		// 调试工具
		env.VITE_APP_DEV_TOOLS && VueDevTools(),
		// mock 服务
		// Mock({ prodEnabled: false }),

		// 组件自动按需引入
		Components({
			directoryAsNamespace: true,
			include: [/\.vue$/, /\.vue\?vue/, /\.[tj]sx$/, /\.md$/],
			// 排除 以 _ 开头并以 .tsx 结尾的文件
			exclude: [/^_[^/]+\.[tj]sx$/],
			extensions: ['md', 'vue', 'tsx', 'jsx'],
			dts: resolve(__dirname, './types/components.d.ts'),
			types: [
				{
					from: 'vue-router',
					names: ['RouterLink', 'RouterView'],
				},
			],
			resolvers: [
				...normalizeResolvers({
					onlyExist: [
						[
							AntDesignVueResolver({
								importStyle: false, // css in js
							}),
							'ant-design-vue',
						],
						[VueUseComponentsResolver(), '@vueuse/components'],
					],
				}),
			],
		}),
		// 使用 icones 中下载的图标：  <icon-ep:arrow-down-bold />
		Icons({
			compiler: 'vue3',
			autoInstall: true,
		}),
		// jsx 和 tsx 支持
		Jsx(),
		// 生产环境资源压缩
		Compression({
			// @ts-ignore
			algorithm: env.VITE_APP_COMPRESSINON_ALGORITHM,
		}),
		// 生产环境下移除 console.log, console.warn, console.error
		process.env.NODE_ENV !== 'debug' && Removelog(),
		// 别名插件
		Alias(),
		ForceRestart(),
	]

	if (env.VITE_APP_API_AUTO_IMPORT) {
		const dirs = env.VITE_APP_DIR_API_AUTO_IMPORT
			? ['src/stores/**', 'src/composables/**', 'src/api/**']
			: undefined
		// api 自动按需引入
		plugins.push(
			AutoImport({
				dirs,
				dts: './presets/types/auto-imports.d.ts',
				imports: [
					...AutoGenerateImports({
						include: [...vue3Presets],
					}),
				],
				eslintrc: {
					enabled: true,
					globalsPropValue: true,
					filepath: 'presets/eslint/.eslintrc-auto-import.json',
				},
			}),
		)
	}
	plugins.push(
		// @ts-ignore
		UnoCss({
			safelist: env.VITE_APP_MARKDOWN ? safelist.split(' ') : undefined,
		}),
	)

	return plugins
}

// 获取环境变量
function useEnv() {
	function detectMode() {
		const { NODE_ENV } = process.env
		const hasModeIndex = argv.findIndex((a) => a === '--mode' || a === '-m')
		if (hasModeIndex !== -1) {
			return argv[hasModeIndex + 1]
		}
		return NODE_ENV || 'development'
	}

	const stringToBoolean = (v: string) => {
		return Boolean(v === 'true' || false)
	}

	const {
		VITE_APP_TITLE,
		VITE_APP_DEV_TOOLS,
		VITE_APP_MARKDOWN,
		VITE_APP_API_AUTO_IMPORT,
		VITE_APP_MOCK_IN_PRODUCTION,
		VITE_APP_DIR_API_AUTO_IMPORT,
		VITE_APP_COMPRESSINON_ALGORITHM,
	} = loadEnv(detectMode(), '.')

	return {
		VITE_APP_TITLE,
		VITE_APP_COMPRESSINON_ALGORITHM,
		VITE_APP_DEV_TOOLS: stringToBoolean(VITE_APP_DEV_TOOLS),
		VITE_APP_MARKDOWN: stringToBoolean(VITE_APP_MARKDOWN),
		VITE_APP_API_AUTO_IMPORT: stringToBoolean(VITE_APP_API_AUTO_IMPORT),
		VITE_APP_MOCK_IN_PRODUCTION: stringToBoolean(VITE_APP_MOCK_IN_PRODUCTION),
		VITE_APP_DIR_API_AUTO_IMPORT: stringToBoolean(VITE_APP_DIR_API_AUTO_IMPORT),
	}
}

type Arrayable<T> = T | Array<T>

interface Options {
	onlyExist?: [Arrayable<ComponentResolver>, string][]
	include?: ComponentResolver[]
}
export const normalizeResolvers = (options: Options = {}) => {
	const { onlyExist = [], include = [] } = options

	const existedResolvers = []
	for (let i = 0; i < onlyExist.length; i++) {
		const [resolver, packageName] = onlyExist[i]
		if (isPackageExists(packageName)) {
			existedResolvers.push(resolver)
		}
	}

	existedResolvers.push(...include)

	return existedResolvers
}

export const _dirname =
	typeof __dirname !== 'undefined'
		? __dirname
		: dirname(fileURLToPath(import.meta.url))

// 别名插件
function Alias(): Plugin {
	const src = resolve(_dirname, '../src')
	const api = resolve(_dirname, '../src/api')
	const types = resolve(_dirname, '../src/types')
	return {
		name: 'vite-alias',
		enforce: 'pre',
		config(config) {
			config.resolve ??= {}
			config.resolve.alias = [
				{ find: /^~@/, replacement: src },
				{ find: /^api/, replacement: api },
				{ find: /^#/, replacement: types },
			]
		},
	}
}

/**
 * 强制重启
 */
function ForceRestart(paths = ['package.json', 'pnpm-lock.yaml']): Plugin {
	const restart = debounce(async function touch() {
		const time = new Date()
		await utimes('vite.config.ts', time, time)
	}, 1000)
	return {
		name: 'vite-plugin-force-restart',
		apply: 'serve',
		configureServer({ watcher }) {
			watcher.add(paths).on('all', async (_, path) => {
				if (paths.includes(path)) {
					await restart()
				}
			})
		},
	}
}
