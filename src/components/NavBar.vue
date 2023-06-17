<script setup lang="ts">
  import { ref } from 'vue'
  import { RouterLink } from 'vue-router'
  import { BoltIcon } from '@heroicons/vue/24/outline'
  import { Bars3Icon } from '@heroicons/vue/24/outline'
  import { XMarkIcon } from '@heroicons/vue/24/outline'

  const mobileMenuOpen = ref(false)
  
  interface Route {
    name: string;
    path: string;
  }

  const navigationRoutes: Route[] = [
    { name: 'home', path: '/' },
    { name: 'meal', path: '/meal' },
    { name: 'day', path: '/day' },
    { name: 'week', path: '/week' }
  ]
</script>

<template>
  <!-- Desktop Nav -->
  <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
    <div class="flex lg:flex-1">
      <RouterLink to="/" class="-m-1.5 p-1.5">
        <span class="sr-only">Random Recipe Generator</span>
        <BoltIcon class="h-8 w-auto" alt="logo" />
      </RouterLink>
    </div>
    <div class="flex lg:hidden">
      <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
        <span class="sr-only">Open main menu</span>
        <Bars3Icon class="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
    <div class="hidden lg:flex lg:gap-x-12">
      <RouterLink v-for="(route, index) in navigationRoutes" :key="index" :to="{ name: route.name }" class="text-sm font-semibold leading-6 text-gray-900">{{ route.name }}</RouterLink>
    </div>
    <div class="hidden lg:flex lg:flex-1 lg:justify-end">
      <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Log in <span aria-hidden="true">&rarr;</span></a>
    </div>
  </nav>

  <!-- Mobile Nav -->
  <div class="lg:hidden" v-show="mobileMenuOpen" @close="mobileMenuOpen = false">
    <div class="fixed inset-0 z-50" />
    <div class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
      <div class="flex items-center justify-between">
        <RouterLink to="/" class="-m-1.5 p-1.5">
          <span class="sr-only">Your Company</span>
          <span class="sr-only">Random Recipe Generator</span>
        </RouterLink>
        <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
          <span class="sr-only">Close menu</span>
          <XMarkIcon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div class="mt-6 flow-root">
        <div class="-my-6 divide-y divide-gray-500/10">
          <div class="space-y-2 py-6">          
            <RouterLink v-for="(route, index) in navigationRoutes" :key="index" :to="{ name: route.name }" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">{{ route.name }}</RouterLink>
          </div>
          <div class="py-6">
            <a href="#" class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Log in</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>