<script setup lang="ts">
import RecipeCard from "~/components/Recipe/RecipeCard.vue";
import RecipeSearchBar from "~/components/Recipe/RecipeSearchBar.vue";
import PopularSearches from "~/components/Recipe/PopularSearches.vue";
import { isPublicRecipe } from "~/utils/recipeSearch";

const { fetchRecipes } = useRecipes();

const searchQuery = ref("");

const { data: recipes, pending: isLoading, error } = await useAsyncData(
  "top-liked-recipes",
  async () => {
    const data = await fetchRecipes({
      page: 1,
      pageSize: 50,
      sortBy: "heartedbyusers",
      sortDirection: "desc",
    });

    return (data.results ?? []).filter(isPublicRecipe).slice(0, 5);
  }
);

const errorMessage = computed(
  () =>
    (error.value as any)?.data?.message ||
    error.value?.message ||
    ""
);

const popularSearches = computed(() => {
  const items = new Set(["Thailand", "Italy", "Pizza", "Sushi", "Pho"]);
  for (const recipe of recipes.value ?? []) {
    items.add(recipe.country.name);
  }
  return Array.from(items).slice(0, 8);
});

function onSearch() {
  const q = searchQuery.value.trim();
  if (!q) return;
  navigateTo({ path: "/recipes", query: { q } });
}

function onPopularSelect(term: string) {
  searchQuery.value = term;
  navigateTo({ path: "/recipes", query: { q: term } });
}
</script>

<template>
  <div class="px-6 py-10 space-y-12">
    <section
      class="grid gap-10 p-6 bg-white border rounded-lg border-stone-200 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start"
    >
      <div class="space-y-5">
        <h1
          class="text-2xl font-bold text-stone-900 sm:text-3xl"
        >
          What would you like to cook?
        </h1>
        <p class="text-stone-600">
          Search by recipe name or country of origin.
        </p>
        <RecipeSearchBar v-model="searchQuery" @submit="onSearch" />
      </div>
      <PopularSearches
        :items="popularSearches"
        @select="onPopularSelect"
      />
    </section>

    <section class="space-y-6">
      <h2
        class="text-2xl font-bold text-stone-900 sm:text-3xl"
      >
        Most liked recipes
      </h2>

      <div
        v-if="errorMessage"
        class="p-3 text-red-700 bg-red-50 border border-red-200 rounded-md"
        role="alert"
      >
        {{ errorMessage }}
      </div>

      <p v-else-if="isLoading" class="text-stone-600">
        Loading recipes...
      </p>

      <p v-else-if="!recipes?.length" class="text-stone-600">
        No recipes to show yet.
      </p>

      <div
        v-else
        class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        <RecipeCard
          v-for="recipe in recipes ?? []"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </section>
  </div>
</template>
