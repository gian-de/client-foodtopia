<script setup lang="ts">
import type { Recipe } from "~/types/recipe";
import RecipeCard from "~/components/Recipe/RecipeCard.vue";

const props = withDefaults(
  defineProps<{
    recipes: Recipe[];
    pageSize?: number;
  }>(),
  { pageSize: 10 }
);

const page = ref(0);
const pageCount = computed(() => Math.max(1, Math.ceil(props.recipes.length / props.pageSize)));
const visible = computed(() => {
  const start = page.value * props.pageSize;
  return props.recipes.slice(start, start + props.pageSize);
});

watch(
  () => props.recipes.map((recipe) => recipe.id).join(),
  () => {
    page.value = 0;
  }
);

function previous() {
  if (page.value > 0) page.value -= 1;
}

function next() {
  if (page.value < pageCount.value - 1) page.value += 1;
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-3 xl:grid-cols-5">
      <RecipeCard v-for="recipe in visible" :key="recipe.id" :recipe="recipe" />
    </div>
    <div v-if="recipes.length > pageSize" class="flex items-center justify-between gap-3">
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:bg-transparent disabled:border disabled:border-stone-300 disabled:text-stone-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        :disabled="page === 0"
        @click="previous"
      >
        Previous
      </button>
      <p class="text-sm text-stone-500">
        Page {{ page + 1 }} of {{ pageCount }}
      </p>
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:bg-transparent disabled:border disabled:border-stone-300 disabled:text-stone-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        :disabled="page >= pageCount - 1"
        @click="next"
      >
        Next
      </button>
    </div>
  </div>
</template>
