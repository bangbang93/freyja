/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import {createApp} from 'vue'
import Element from 'element-plus'
import 'element-plus/dist/index.css'
import 'font-awesome/scss/font-awesome.scss'
import VueFetch from 'vue-fetch'
import App from './pages/index.vue'
import router from './router'

export const app = createApp(App)

app.use(Element)
app.use(VueFetch)
app.use(router)

// const store = createStore()

// sync(store, router)
app.mount('#app')
