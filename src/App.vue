<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import NavBar from './components/NavBar.vue';
</script>

<template>
  <div class="bg-white flex flex-col">
    <header class="inset-x-0 top-0 z-50">
      <NavBar />
    </header>

    <RouterView />
  </div>
</template>