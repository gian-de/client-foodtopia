<script setup lang="ts">
const props = defineProps<{
  items: string[];
}>();

const emit = defineEmits<{
  select: [value: string];
}>();
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold text-stone-900">
      Popular searches
    </h2>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="item in items"
        :key="item"
        type="button"
        class="px-3 py-1.5 text-sm font-medium text-white transition-colors rounded cursor-pointer bg-brand-600 hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        @click="emit('select', item)"
      >
        {{ item }}
      </button>
    </div>
  </div>
</template>
