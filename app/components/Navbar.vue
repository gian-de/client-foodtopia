<script setup lang="ts">
import { NuxtLink } from "#components";

const navAuthLinks = [
  { id: 1, name: "register", to: "/register" },
  { id: 2, name: "login", to: "/login" },
];
</script>

<template>
  <nav class="sticky top-0 z-30 px-6 py-8 bg-gray-700">
    <div class="flex justify-between max-w-[1800px] mx-auto">
      <NuxtLink to="/" class="text-4xl text-green-500 uppercase cursor-pointer"
        >Foodtopia</NuxtLink
      >
      <div class="flex items-center space-x-4 text-xl text-slate-50">
        <NuxtLink
          v-for="link in navAuthLinks"
          :to="link.to"
          class="px-3 py-1 capitalize rounded-md cursor-pointer"
          active-class="text-black bg-gray-200"
        >
          {{ link.name }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
