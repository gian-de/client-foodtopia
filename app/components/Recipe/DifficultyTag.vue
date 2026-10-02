<script setup lang="ts">
import { getDifficultyTag } from "~/utils/difficulty";

const props = defineProps<{
  average: number | null | undefined;
}>();

const tag = computed(() => getDifficultyTag(props.average));

const levelClass: Record<string, string> = {
  easy:
    "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
  medium:
    "bg-amber-50 text-amber-900 ring-1 ring-amber-200",
  hard:
    "bg-stone-100 text-stone-800 ring-1 ring-stone-300",
  unrated:
    "bg-stone-100 text-stone-500 ring-1 ring-stone-200",
};
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full w-fit"
    :class="levelClass[tag.level]"
  >
    <span class="sr-only">Difficulty: </span>{{ tag.label }}
  </span>
</template>
