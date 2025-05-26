import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

const router = createRouter({
  history: createWebHashHistory('/sweng861-social-media-login/'),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
    }
  ],
})

export default router
