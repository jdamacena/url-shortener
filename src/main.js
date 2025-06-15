import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import UrlShortener from './components/UrlShortener.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: UrlShortener },
    { path: '/dashboard', component: () => import('./components/Dashboard.vue') }
  ]
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
