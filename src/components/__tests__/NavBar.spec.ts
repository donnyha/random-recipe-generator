import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NavBar from '../NavBar.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MealView from '@/views/MealView.vue'
import DayView from '@/views/DayView.vue'
import WeekView from '@/views/WeekView.vue'

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

describe('NavBar', () => {
  const wrapper = mount(NavBar, {
    global: {
      plugins: [router]
    }
  })

  const navBar = wrapper.findComponent(NavBar)

  it('renders properly', () => {
    expect(navBar.exists()).toBe(true)
  })

  it('navigates to home route when clicked', () => {
    const homeLink = wrapper.find('a#home')
    homeLink.trigger('click')
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('navigates to meal route when clicked', async () => {
    const mealLink = wrapper.find('a#meal')
    await mealLink.trigger('click')
    expect(router.currentRoute.value.name).toBe('meal')
  })
})
