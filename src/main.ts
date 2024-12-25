import { createApp } from 'vue'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import './style.css'

const app = createApp(App)

setupStore(app)
app.mount('#app')
