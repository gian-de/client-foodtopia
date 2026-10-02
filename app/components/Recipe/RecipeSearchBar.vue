<script setup lang="ts">
import SearchIcon from "~/components/svgs/SearchIcon.vue";

const emit = defineEmits<{
  "update:modelValue": [value: string];
  submit: [];
}>();

defineProps<{
  modelValue: string;
}>();

const placeholders = ["Recipe name", "Country of origin"];
const placeholderIndex = ref(0);
let intervalId: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  intervalId = setInterval(() => {
    placeholderIndex.value =
      (placeholderIndex.value + 1) % placeholders.length;
  }, 3200);
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});

function onSubmit() {
  emit("submit");
}
</script>

<template>
  <form class="w-full" @submit.prevent="onSubmit">
    <label class="sr-only" for="recipe-search">Search recipes</label>
    <div
      class="flex overflow-hidden border rounded-md border-stone-300 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20"
    >
      <input
        id="recipe-search"
        :value="modelValue"
        type="search"
        :placeholder="placeholders[placeholderIndex]"
        class="flex-1 min-w-0 px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-none sm:py-3.5 sm:text-lg"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
      <button
        type="submit"
        class="flex items-center justify-center px-4 transition-colors cursor-pointer bg-brand-600 text-white shrink-0 hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:px-5"
        aria-label="Search recipes"
      >
        <SearchIcon />
      </button>
    </div>
  </form>
</template>
