<script setup lang="ts">
  import { RouterView, RouterLink } from 'vue-router'
  import NavBar from './components/NavBar.vue';
</script>

<!-- <template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template> -->

<template>
  <div class="bg-white">
    <header class="absolute inset-x-0 top-0 z-50">
      <NavBar />
    </header>

    <RouterView />
  </div>
</template>