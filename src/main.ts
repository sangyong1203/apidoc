import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/assets/css/main.scss'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElIconModules from '@element-plus/icons-vue' // ElementPlus 아이콘

import App from './App.vue'
import router from '@/router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import print from 'vue3-print-nb' // 프린트기능
import TuiGrid from 'vue3-tui-grid'
import 'tui-date-picker/dist/tui-date-picker.css' // use datepicker
import VueKonva from 'vue-konva';

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(print)
app.use(TuiGrid)
app.use(VueKonva)

// ElementPlus 아이콘 등록
for (const [key, component] of Object.entries(ElIconModules)) {
    app.component(key, component)
}
app.mount('#app')


