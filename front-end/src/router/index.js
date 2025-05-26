import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
      path: '/',
      name: 'Login',
      component: Login,
  }
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
