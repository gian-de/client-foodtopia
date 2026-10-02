<script setup lang="ts">
import { pageItems, text } from "~/utils/json";

const { apiUrl } = useApiBase();

const { data: playlists, pending: isLoading, error } = await useAsyncData("public-playlists", async () => {
  const data = await $fetch(apiUrl("/api/playlists?page=1&pageSize=24&sortBy=heartedByCount&sortDirection=desc"));
  return pageItems(data);
});

const errorMessage = computed(() => (error.value ? "Could not load playlists." : ""));
</script>

<template>
  <div class="px-6 py-10 space-y-8">
    <header class="space-y-2">
      <h1 class="text-2xl font-bold text-stone-900 sm:text-3xl">Playlists</h1>
      <p class="text-stone-600">Public playlists. Heart one to keep it on your dashboard.</p>
    </header>
    <p v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">
      {{ errorMessage }}
    </p>
    <p v-else-if="isLoading" class="text-stone-600">Loading playlists...</p>
    <p v-else-if="!playlists?.length" class="text-stone-600">No public playlists yet.</p>
    <ul v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="playlist in playlists"
        :key="text(playlist, 'id', 'Id')"
        class="flex items-start justify-between gap-3 p-5 bg-white border rounded-lg border-stone-200"
      >
        <div class="space-y-1">
          <NuxtLink
            :to="`/playlists/${text(playlist, 'fullSlug', 'FullSlug')}`"
            class="text-lg font-semibold text-stone-900 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            {{ text(playlist, "name", "Name") }}
          </NuxtLink>
          <p class="text-sm text-stone-500">
            {{ text(playlist, "recipeCount", "RecipeCount") || "0" }} recipes
          </p>
        </div>
        <HeartButton
          kind="playlist"
          :id="text(playlist, 'id', 'Id')"
          :count="Number(text(playlist, 'heartedByCount', 'HeartedByCount') || 0)"
        />
      </li>
    </ul>
  </div>
</template>
