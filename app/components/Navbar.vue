<script setup lang="ts">
import { NuxtLink } from "#components";
</script>

<template>
  <nav class="sticky top-0 z-30 px-6 py-8 bg-gray-700">
    <div class="flex justify-between max-w-[1800px] mx-auto">
      <NuxtLink to="/" class="text-4xl text-green-500 uppercase cursor-pointer"
        >Foodtopia</NuxtLink
      >
      <div class="space-x-4 text-xl text-slate-50">
        <NuxtLink
          to="/register"
          class="px-3 py-1 rounded-md cursor-pointer"
          active-class="text-black bg-gray-200"
        >
          Register
        </NuxtLink>
        <NuxtLink
          to="/login"
          class="px-3 py-1 rounded-md cursor-pointer"
          active-class="text-black bg-gray-200"
        >
          Login
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
