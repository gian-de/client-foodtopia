<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
</script>

<template>
  <div class="">
    <Navbar />
    <main class="max-w-[1800px] mx-auto">
      <slot />
    </main>
  </div>
</template>
