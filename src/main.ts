// https://unocss.dev/ 原子 css 库
import '@unocss/reset/tailwind-compat.css' // unocss reset
import 'virtual:uno.css'
import 'virtual:unocss-devtools'
import { scrollbar } from '~@/composables/directives/scrollbar'

// 你自定义的 css
import './styles/main.css'
import App from './App.vue'
const app = createApp(App)
app.directive('scrollbar', scrollbar)
app.mount('#app')
