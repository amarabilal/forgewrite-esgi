import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { Controls } from '@vue-flow/controls'

import piniaPersistedstate from 'pinia-plugin-persistedstate'
import api from '@/services/api'
import 'quill/dist/quill.snow.css'
import VueMatomo from 'vue-matomo'

// Global CSS reset
const globalStyles = `
  body {
    margin: 0;
    padding: 0;
  }
`
const styleElement = document.createElement('style')
styleElement.textContent = globalStyles
document.head.appendChild(styleElement)


const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersistedstate)

app.use(pinia)
app.use(router)

app.use(VueMatomo, {
  host: 'https://analytics.forgewrite.fr',
  siteId: 1,
  router,
  enableLinkTracking: true,
  requireConsent: false,
  trackInitialView: true,
  enableHeartBeatTimer: true,
  heartBeatTimerInterval: 15,
})

app.mount('#app')

import { useAuthStore } from '@/store/authStore'
const auth = useAuthStore()

if (auth.token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`
}

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth && !auth.user && auth.token) {
    try {
      await auth.fetchMe()
      next()
    } catch {
      await auth.logout()
      next('/login')
    }
  } else {
    next()
  }
})
