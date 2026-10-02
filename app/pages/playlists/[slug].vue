<script setup lang="ts">
import { asRecord, field, text } from "~/utils/json";
import { mediaUrl } from "~/utils/mediaUrl";

const route = useRoute();
const { apiUrl, assetBase } = useApiBase();

const { data: playlist, pending: isLoading, error } = await useAsyncData(
  () => `playlist-${route.params.slug}`,
  async () => asRecord(await $fetch(apiUrl(`/api/playlists/${route.params.slug}`)))
);

const errorMessage = computed(() => (error.value ? "Could not load that playlist." : ""));
const heartCount = ref(0);
const recipes = computed(() => {
  const list = field(playlist.value ?? {}, "recipes", "Recipes");
  return Array.isArray(list) ? list.map(asRecord) : [];
});

watch(
  playlist,
  (value) => {
    heartCount.value = Number(text(value ?? {}, "heartedByCount", "HeartedByCount") || 0);
  },
  { immediate: true }
);
</script>

<template>
  <div class="px-6 py-10 space-y-8">
    <NuxtLink
      to="/playlists"
      class="inline-flex items-center text-sm font-medium text-stone-600 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      ← Back to playlists
    </NuxtLink>
    <p v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">
      {{ errorMessage }}
    </p>
    <p v-else-if="isLoading" class="text-stone-600">Loading playlist...</p>
    <article v-else-if="playlist" class="max-w-3xl mx-auto space-y-8">
      <img
        v-if="text(playlist, 'imageUrl', 'ImageUrl')"
        :src="mediaUrl(assetBase, text(playlist, 'imageUrl', 'ImageUrl'))"
        :alt="text(playlist, 'name', 'Name')"
        class="object-cover w-full max-h-[420px] bg-stone-200 rounded-lg"
      />
      <header class="space-y-3">
        <h1 class="text-3xl font-bold text-stone-900 sm:text-4xl">
          {{ text(playlist, "name", "Name") }}
        </h1>
        <div class="flex flex-wrap items-center gap-3 text-sm text-stone-600">
          <HeartButton
            kind="playlist"
            :id="text(playlist, 'id', 'Id')"
            :count="heartCount"
            @update:count="heartCount = $event"
          >
            {{ heartCount }} likes
          </HeartButton>
          <span>{{ text(playlist, "recipeCount", "RecipeCount") || recipes.length }} recipes</span>
        </div>
      </header>
      <section class="p-6 space-y-4 bg-white border rounded-lg border-stone-200">
        <h2 class="text-xl font-bold text-stone-900">Recipes</h2>
        <p v-if="!recipes.length" class="text-sm text-stone-500">This playlist has no recipes yet.</p>
        <ul v-else class="space-y-3">
          <li v-for="recipe in recipes" :key="text(recipe, 'id', 'Id')" class="flex items-center justify-between gap-3">
            <NuxtLink
              :to="`/recipes/${text(recipe, 'id', 'Id')}`"
              class="font-medium text-stone-900 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              {{ text(recipe, "name", "Name") }}
            </NuxtLink>
            <HeartButton
              kind="recipe"
              :id="text(recipe, 'id', 'Id')"
              :count="Number(text(recipe, 'heartCount', 'HeartCount') || 0)"
            />
          </li>
        </ul>
      </section>
    </article>
  </div>
</template>
