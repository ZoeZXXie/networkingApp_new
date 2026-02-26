import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Profile from '../views/Profile.vue'
import Friends from '../views/Friends.vue'
import Messages from '../views/Messages.vue'
import axios from 'axios'
import { onMounted } from 'vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/profile', component: Profile },
  { path: '/home', component: Home },
  { path: '/friends/:id?', component: Friends },
  { path: '/messages', component: Messages }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route Guard
router.beforeEach(async (to, from, next) => {
  if (to.path === '/home') {
    try {
      await axios.get('http://localhost:3000/me', { withCredentials: true })
      next()
    } catch {
      next('/login')
    }
  } else {
    next()
  }
})

export default router