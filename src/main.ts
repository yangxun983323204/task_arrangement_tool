//import './assets/main.css'

import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { zhHans, en } from 'vuetify/locale'

import App from './App.vue'


const vuetify = createVuetify({
    // 引用的组件通过摇树插件自动收集
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
    locale: {
        locale: 'zhHans',
        fallback: 'en',
        messages: { zhHans, en },
    },
})

const app = createApp(App)

app.use(vuetify).mount('#app')