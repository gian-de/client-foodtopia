<script setup lang="ts">
import type { Recipe } from "~/types/recipe";
import RecipeCarousel from "~/components/Recipe/RecipeCarousel.vue";
import RecipeSearchBar from "~/components/Recipe/RecipeSearchBar.vue";
import PopularSearches from "~/components/Recipe/PopularSearches.vue";
import { isPublicRecipe } from "~/utils/recipeSearch";

const { fetchRecipes } = useRecipes();

const searchQuery = ref("");
const sort = ref<"newest" | "oldest" | "liked">("newest");
const country = ref("");
const selectClass =
  "px-3 py-2 text-sm border rounded-md border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

const { data: recipes, pending: isLoading, error } = await useAsyncData(
  "home-public-recipes",
  async () => {
    const pageSize = 100;
    const first = await fetchRecipes({
      page: 1,
      pageSize,
      sortBy: "PublishedAt",
      sortDirection: "desc",
    });
    const all = [...(first.results ?? [])];
    for (let page = 2; page <= (first.totalPages ?? 1); page += 1) {
      const next = await fetchRecipes({
        page,
        pageSize,
        sortBy: "PublishedAt",
        sortDirection: "desc",
      });
      all.push(...(next.results ?? []));
    }
    return all.filter(isPublicRecipe);
  }
);

const errorMessage = computed(
  () =>
    (error.value as any)?.data?.message ||
    error.value?.message ||
    ""
);

const publicRecipes = computed(() => recipes.value ?? []);

const topLiked = computed(() =>
  [...publicRecipes.value].sort((a, b) => b.heartCount - a.heartCount).slice(0, 20)
);

const countries = computed(() => {
  const names = new Set<string>();
  for (const recipe of publicRecipes.value) {
    if (recipe.country?.name) names.add(recipe.country.name);
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b));
});

const catalog = computed(() => {
  const selected = country.value;
  const list = publicRecipes.value.filter((recipe) => !selected || recipe.country.name === selected);
  return [...list].sort(compareRecipes);
});

function compareRecipes(a: Recipe, b: Recipe) {
  if (sort.value === "liked") return b.heartCount - a.heartCount || b.publishedAt.localeCompare(a.publishedAt);
  if (sort.value === "oldest") return a.publishedAt.localeCompare(b.publishedAt);
  return b.publishedAt.localeCompare(a.publishedAt);
}

const popularSearches = computed(() => {
  const items = new Set(["Thailand", "Italy", "Pizza", "Sushi", "Pho"]);
  for (const recipe of topLiked.value) items.add(recipe.country.name);
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
  <div class="px-6 py-10 space-y-16">
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

    <div
      v-if="errorMessage"
      class="p-3 text-red-700 bg-red-50 border border-red-200 rounded-md"
      role="alert"
    >
      {{ errorMessage }}
    </div>
    <p v-else-if="isLoading" class="text-stone-600">Loading recipes...</p>
    <template v-else>
      <section class="space-y-6">
        <h2 class="text-2xl font-bold text-stone-900 sm:text-3xl">Most liked</h2>
        <p v-if="!topLiked.length" class="text-stone-600">No recipes to show yet.</p>
        <RecipeCarousel v-else :recipes="topLiked" />
      </section>

      <section class="pt-12 space-y-6 border-t border-stone-200">
        <div class="space-y-4">
          <h3 class="text-2xl font-bold text-stone-900">All recipes</h3>
          <div class="flex flex-col gap-3 sm:flex-row">
            <label class="space-y-1 text-sm font-medium text-stone-700">
              Sort
              <select v-model="sort" :class="selectClass" class="block w-full sm:w-48">
                <option value="newest">Newest approved</option>
                <option value="oldest">Oldest approved</option>
                <option value="liked">Most liked</option>
              </select>
            </label>
            <label class="space-y-1 text-sm font-medium text-stone-700">
              Country
              <select v-model="country" :class="selectClass" class="block w-full sm:w-48">
                <option value="">All countries</option>
                <option v-for="name in countries" :key="name" :value="name">{{ name }}</option>
              </select>
            </label>
          </div>
        </div>
        <p v-if="!catalog.length" class="text-stone-600">No recipes to show yet.</p>
        <RecipeCarousel v-else :recipes="catalog" />
      </section>
    </template>
  </div>
</template>
