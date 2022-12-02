/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import Element from 'element-plus'
import {createApp} from 'vue'
import VueFetch from 'vue-fetch'
import App from '../pages/admin/login.vue'

export const app = createApp(App)

app.use(Element)
app.use(VueFetch)
