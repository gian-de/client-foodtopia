<script setup lang="ts">
import RecipeCard from "~/components/Recipe/RecipeCard.vue";
import RecipeSearchBar from "~/components/Recipe/RecipeSearchBar.vue";
import { isPublicRecipe, matchesRecipeSearch } from "~/utils/recipeSearch";

const route = useRoute();
const { fetchRecipes } = useRecipes();

const searchQuery = ref(String(route.query.q ?? ""));

const { data: recipes, pending: isLoading, error } = await useAsyncData(
  () => `recipe-search-${String(route.query.q ?? "")}`,
  async () => {
    const q = String(route.query.q ?? "").trim();
    const data = await fetchRecipes({
      page: 1,
      pageSize: 200,
      sortBy: "heartedbyusers",
      sortDirection: "desc",
      search: q,
    });

    return (data.results ?? [])
      .filter(isPublicRecipe)
      .filter((recipe) => matchesRecipeSearch(recipe, q));
  },
  { watch: [() => route.query.q] }
);

const errorMessage = computed(
  () =>
    (error.value as any)?.data?.message ||
    error.value?.message ||
    ""
);

function onSearch() {
  const q = searchQuery.value.trim();
  navigateTo({ path: "/recipes", query: q ? { q } : {} });
}

watch(
  () => route.query.q,
  (value) => {
    searchQuery.value = String(value ?? "");
  }
);
</script>

<template>
  <div class="px-6 py-10 space-y-10">
    <section
      class="max-w-2xl p-6 mx-auto space-y-4 bg-white border rounded-lg border-stone-200 sm:p-8"
    >
      <h1
        class="text-2xl font-bold text-stone-900 sm:text-3xl"
      >
        Search recipes
      </h1>
      <RecipeSearchBar v-model="searchQuery" @submit="onSearch" />
    </section>

    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-stone-900">
        {{
          String(route.query.q || "").trim()
            ? `Results for “${String(route.query.q).trim()}”`
            : "All recipes"
        }}
      </h2>

      <div
        v-if="errorMessage"
        class="p-3 text-red-700 bg-red-50 border border-red-200 rounded-md"
        role="alert"
      >
        {{ errorMessage }}
      </div>

      <p v-else-if="isLoading" class="text-stone-600">
        Searching...
      </p>

      <p v-else-if="!recipes?.length" class="text-stone-600">
        No recipes matched that name or country.
      </p>

      <div
        v-else
        class="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-3 xl:grid-cols-4"
      >
        <RecipeCard
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </section>
  </div>
</template>
