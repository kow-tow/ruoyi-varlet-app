import { createApp } from 'vue'
import dayjs from 'dayjs'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'
import '@/styles/common.less'
import '@varlet/touch-emulator'
import 'virtual:uno.css'
import 'virtual-icons'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const app = createApp(App)

app.config.globalProperties.$dayjs = dayjs

app.use(router).use(createPinia()).mount('#app')
