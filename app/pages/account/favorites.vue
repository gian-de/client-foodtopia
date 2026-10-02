<script setup lang="ts">
import EmptyState from "~/components/ui/EmptyState.vue";
import { pageItems, text } from "~/utils/json";
import HeartIcon from "@/components/svgs/HeartIcon.vue";

const { authFetch } = useAuthFetch();
const recipes = ref<Record<string, unknown>[]>([]);
const playlists = ref<Record<string, unknown>[]>([]);
const errorMessage = ref("");
const isLoading = ref(false);

async function load() {
  isLoading.value = true;
  errorMessage.value = "";
  const [recipeResult, playlistResult] = await Promise.allSettled([
    authFetch("/api/recipes/hearted-recipes?page=1&pageSize=50"),
    authFetch("/api/playlists/hearted?page=1&pageSize=50"),
  ]);
  if (recipeResult.status === "fulfilled") recipes.value = pageItems(recipeResult.value);
  if (playlistResult.status === "fulfilled") playlists.value = pageItems(playlistResult.value);
  const failed = [recipeResult, playlistResult].filter((result) => result.status === "rejected");
  if (failed.some((result) => ((result.reason as { status?: number }).status ?? 0) >= 500)) {
    errorMessage.value = "Could not load favorites.";
  }
  isLoading.value = false;
}

onMounted(load);
</script>

<template>
  <VerifiedGate>
    <div class="grid gap-6 lg:grid-cols-2">
      <section class="p-6 space-y-4 bg-white border rounded-lg border-stone-200">
        <h2 class="text-lg font-semibold text-stone-900">Hearted recipes</h2>
        <p v-if="isLoading" class="text-sm text-stone-500">Loading…</p>
        <EmptyState
          v-else-if="!recipes.length"
          title="No hearted recipes"
          description="Heart a recipe from its page and it will show up here."
        >
          <HeartIcon />
        </EmptyState>
        <ul v-else class="space-y-3">
          <li v-for="recipe in recipes" :key="text(recipe, 'id', 'Id')" class="flex items-center justify-between gap-3">
            <NuxtLink :to="`/recipes/${text(recipe, 'id', 'Id')}`" class="font-medium text-brand-600 hover:text-brand-700">
              {{ text(recipe, "name", "Name") }}
            </NuxtLink>
            <HeartButton kind="recipe" :id="text(recipe, 'id', 'Id')" :count="Number(text(recipe, 'heartCount', 'HeartCount') || 0)" />
          </li>
        </ul>
      </section>
      <section class="p-6 space-y-4 bg-white border rounded-lg border-stone-200">
        <h2 class="text-lg font-semibold text-stone-900">Hearted playlists</h2>
        <p v-if="isLoading" class="text-sm text-stone-500">Loading…</p>
        <EmptyState
          v-else-if="!playlists.length"
          title="No hearted playlists"
          description="Playlists you heart will be listed here."
        >
          <HeartIcon />
        </EmptyState>
        <ul v-else class="space-y-3">
          <li v-for="playlist in playlists" :key="text(playlist, 'id', 'Id')" class="flex items-center justify-between gap-3">
            <NuxtLink :to="`/playlists/${text(playlist, 'fullSlug', 'FullSlug')}`" class="font-medium text-brand-600 hover:text-brand-700">
              {{ text(playlist, "name", "Name") }}
            </NuxtLink>
            <HeartButton kind="playlist" :id="text(playlist, 'id', 'Id')" :count="Number(text(playlist, 'heartedByCount', 'HeartedByCount') || 0)" />
          </li>
        </ul>
      </section>
    </div>
    <p v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">
      {{ errorMessage }}
    </p>
  </VerifiedGate>
</template>
