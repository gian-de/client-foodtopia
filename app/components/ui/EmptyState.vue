<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <div
    class="flex flex-col items-center px-6 py-10 text-center border border-dashed rounded-lg border-brand-500/40 bg-brand-50"
  >
    <div
      class="flex items-center justify-center rounded-full size-14 bg-brand-100 text-brand-700"
      aria-hidden="true"
    >
      <slot />
    </div>
    <p class="mt-4 text-base font-semibold text-stone-900">{{ title }}</p>
    <p class="max-w-sm mt-1 text-sm text-stone-600">{{ description }}</p>
  </div>
</template>
