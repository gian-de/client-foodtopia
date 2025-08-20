<script setup lang="ts">
import { NuxtLink } from "#components";

const navAuthLinks = [
  { id: 1, name: "register", to: "/register" },
  { id: 2, name: "login", to: "/login" },
];

const auth = useAuthStore();
const { user, isAuthenticated } = storeToRefs(auth);

function onClickSignOut() {
  auth.logout();
}
</script>

<template>
  <nav class="sticky top-0 z-30 px-6 py-8 bg-zinc-200">
    <div class="flex justify-between max-w-[1800px] mx-auto">
      <NuxtLink to="/" class="text-4xl text-green-600 uppercase cursor-pointer"
        >Foodtopia</NuxtLink
      >
      <ClientOnly>
        <div
          v-if="isAuthenticated"
          class="flex items-center space-x-4 text-xl text-black"
        >
          <NuxtLink
            @click="onClickSignOut"
            class="px-3 py-1 capitalize cursor-pointer"
          >
            Sign out
          </NuxtLink>
        </div>
        <div v-else class="flex items-center space-x-4 text-xl text-black">
          <NuxtLink
            v-for="link in navAuthLinks"
            :to="link.to"
            class="px-3 py-1 capitalize rounded-md cursor-pointer"
            active-class="px-3 py-1 bg-zinc-500 text-slate-100"
          >
            {{ link.name }}
          </NuxtLink>
        </div>
      </ClientOnly>
    </div>
  </nav>
</template>
