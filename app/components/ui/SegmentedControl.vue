<script setup lang="ts">
defineProps<{
  label: string;
  name: string;
  modelValue: string;
  options: { value: string; label: string }[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <fieldset class="space-y-2">
    <legend class="text-xs font-semibold tracking-wide uppercase text-brand-700">
      {{ label }}
    </legend>
    <div
      class="inline-flex flex-wrap gap-1 p-1 border rounded-lg border-brand-100 bg-brand-50"
      role="radiogroup"
      :aria-label="label"
    >
      <label
        v-for="option in options"
        :key="option.value"
        class="cursor-pointer"
      >
        <input
          class="sr-only"
          type="radio"
          :name="name"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="emit('update:modelValue', option.value)"
        />
        <span
          class="inline-flex px-3 py-1.5 text-sm font-medium rounded-md"
          :class="
            modelValue === option.value
              ? 'bg-brand-600 text-white'
              : 'text-stone-700 hover:text-brand-700'
          "
        >
          {{ option.label }}
        </span>
      </label>
    </div>
  </fieldset>
</template>
