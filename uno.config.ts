import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetTypography,
	presetUno,
} from 'unocss'

import presetAutoprefixer from './presets/autoprefixer'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
	shortcuts: [
		{ flex_c: 'flex items-center' },
		{ flex_cc: 'flex items-center justify-center' },
		{ flex_col_center: 'flex flex-col items-center justify-center' },
		{ flex_row_center: 'flex flex-row items-center justify-center' },
		{ inline_flex_c: 'inline-flex justify-center items-center' },
	],

	theme: {
		colors: {
			hui: 'rgb(242, 243, 245)',
			main: '#1677ff',
			t88: 'rgba(0, 0, 0, 0.88)',
		},
	},
	transformers: [transformerDirectives(), transformerVariantGroup()],
	presets: [
		presetAttributify(),
		// {	autoInstall: true}
		presetIcons(),
		presetUno(),
		presetTypography(),
		presetAutoprefixer(),
	],
	rules: [],
})
