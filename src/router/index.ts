import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MealView from '../views/MealView.vue'
import DayView from '../views/DayView.vue'
import WeekView from '../views/WeekView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/meal',
      name: 'meal',
      component: MealView
    },
    {
      path: '/day',
      name: 'day',
      component: DayView
    },
    {
      path: '/week',
      name: 'week',
      component: WeekView
    }
  ]
})

export default router
