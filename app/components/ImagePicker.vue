<script setup lang="ts">
const props = defineProps<{
  modelValue: string[];
  max: number;
  folder: string;
  cover?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [string[]];
  "update:busy": [boolean];
}>();

const { uploadImage } = useImageUpload();
const uploading = ref<Record<number, boolean>>({});
const slotError = ref<Record<number, string>>({});

const fileClass =
  "block w-full text-sm text-stone-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-60";

watch(
  uploading,
  (value) => emit("update:busy", Object.values(value).some(Boolean)),
  { deep: true }
);

function updateAt(index: number, url: string) {
  const next = [...props.modelValue];
  next[index] = url;
  emit("update:modelValue", next);
}

function addSlot() {
  if (props.modelValue.length >= props.max) return;
  emit("update:modelValue", [...props.modelValue, ""]);
}

function removeSlot(index: number) {
  const next = props.modelValue.filter((_, itemIndex) => itemIndex !== index);
  emit("update:modelValue", next.length ? next : [""]);
  delete uploading.value[index];
  delete slotError.value[index];
}

async function onFile(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;

  slotError.value[index] = "";
  uploading.value[index] = true;
  try {
    updateAt(index, await uploadImage(file, props.folder));
  } catch (err) {
    slotError.value[index] = err instanceof Error ? err.message : "Could not upload that photo.";
  } finally {
    uploading.value[index] = false;
  }
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="(url, index) in modelValue"
      :key="index"
      class="p-3 space-y-2 border rounded-md"
      :class="cover && index === 0 ? 'border-brand-600 bg-brand-50' : 'border-stone-200 bg-white'"
    >
      <div v-if="cover && index === 0" class="space-y-1">
        <p class="text-sm font-semibold text-brand-700">Default image</p>
        <p class="text-sm text-stone-600">This photo is the one shown on recipe cards.</p>
      </div>
      <p v-else-if="cover" class="text-sm font-medium text-stone-700">Photo {{ index + 1 }}</p>
      <img
        v-if="url"
        :src="url"
        alt=""
        class="object-cover w-full bg-stone-200 rounded-md"
        :class="cover && index === 0 ? 'h-40' : 'h-28'"
      />
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        :disabled="uploading[index]"
        :aria-label="cover && index === 0 ? 'Default image' : `Photo ${index + 1}`"
        :class="fileClass"
        @change="onFile(index, $event)"
      />
      <p v-if="uploading[index]" class="text-sm text-stone-500">Uploading…</p>
      <p v-if="slotError[index]" class="text-sm text-red-700" role="alert">{{ slotError[index] }}</p>
      <button
        v-if="modelValue.length > 1"
        type="button"
        class="text-sm font-medium text-stone-600 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        @click="removeSlot(index)"
      >
        Remove
      </button>
    </div>
    <button
      v-if="modelValue.length < max"
      type="button"
      class="text-sm font-medium text-brand-600 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      @click="addSlot"
    >
      Add image
    </button>
  </div>
</template>
