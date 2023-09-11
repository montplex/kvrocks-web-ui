import Scrollbar from 'smooth-scrollbar'

const extractProp = (prop: any) => (obj: any) =>
	typeof obj === 'undefined' ? undefined : obj[prop]
const extractOptions = extractProp('options')
const extractEl = extractProp('el')

const bestMatch = (extractor: any) => (possibilities: any) =>
	extractor(possibilities.find((p: any) => typeof extractor(p) !== 'undefined'))
const bestEl = bestMatch(extractEl)
const bestOptions = bestMatch(extractOptions)

export const scrollbar = {
	mounted(el: any, binding: any) {
		const possibilities = [binding.value]
		const targetEl = bestEl(possibilities)
		const config = bestOptions(possibilities)

		const scrollY = binding.modifiers.y
		const scrollX = binding.modifiers.x
		Scrollbar.init(targetEl ? document.querySelector(targetEl) : el)
	},

	updated(el: any, binding: any, vnode: any, prevVnode: any) {},

	unmounted(el: any, binding: any) {
		const possibilities = [binding.value]
		const targetEl = bestEl(possibilities)
		// @ts-ignore
		Scrollbar.destroy(targetEl ? document.querySelector(targetEl) : el, {})
	},
}
