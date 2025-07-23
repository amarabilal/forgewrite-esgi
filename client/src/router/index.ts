import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Dashboard from '@/pages/Dashboard.vue'
import CreateBook from '@/pages/CreateBook.vue'
import NotFound from '@/pages/NotFound.vue'
import { useAuthStore } from '@/store/authStore'
import Profile from '@/pages/Profile.vue'


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/books/new', name: 'CreateBook', component: CreateBook, meta: { requiresAuth: true } },
  {
    path: '/books/:id',
    name: 'BookEditor',
    component: () => import('@/pages/BookEditor.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/pages/Admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  if (to.meta.requiresAuth && !auth.token) {
    return next('/login')
  }
  
  if (to.meta.requiresAdmin && (!auth.user || auth.user.role !== 'admin')) {
    return next('/dashboard')
  }
  
  next()
})

export default router
