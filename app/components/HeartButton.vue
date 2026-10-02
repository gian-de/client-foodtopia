<script setup lang="ts">
import HeartIcon from "~/components/svgs/HeartIcon.vue";

const props = defineProps<{
  kind: "recipe" | "playlist";
  id: string;
  count: number;
}>();

const emit = defineEmits<{ "update:count": [count: number] }>();

const hearts = useHearts();
const notice = ref("");
const busy = ref(false);
const hearted = computed(() => hearts.has(props.kind, props.id));
const lockedMessage = computed(() =>
  props.kind === "recipe"
    ? "Only verified users can heart recipes."
    : "Only verified users can heart playlists."
);

onMounted(() => {
  hearts.ensure();
});

async function onHeart() {
  notice.value = "";
  if (!hearts.isVerified.value) {
    notice.value = lockedMessage.value;
    return;
  }
  busy.value = true;
  const nextOn = !hearted.value;
  try {
    await hearts.toggle(props.kind, props.id);
    emit("update:count", Math.max(0, props.count + (nextOn ? 1 : -1)));
  } catch (err) {
    notice.value = err instanceof Error ? err.message : "Could not update that heart.";
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <span class="relative inline-flex group">
    <button
      type="button"
      class="inline-flex items-center gap-1 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-60"
      :aria-pressed="hearted"
      :aria-label="hearted ? 'Remove heart' : 'Heart'"
      :title="hearts.isVerified ? undefined : lockedMessage"
      :disabled="busy"
      @click.stop.prevent="onHeart"
    >
      <HeartIcon class="size-4 text-brand-600" :filled="hearted" />
      <slot>{{ count }}</slot>
    </button>
    <span
      v-if="!hearts.isVerified || notice"
      class="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-md bg-stone-900 px-3 py-2 text-xs font-medium text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
      role="tooltip"
    >
      {{ notice || lockedMessage }}
    </span>
  </span>
</template>
