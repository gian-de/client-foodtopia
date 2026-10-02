<script setup lang="ts">
const auth = useAuthStore();
const isGuest = computed(() => auth.user?.role === "Guest");
</script>

<template>
  <p v-if="isGuest" class="text-sm text-stone-500">
    Only verified users can access these links.
  </p>
  <slot v-else />
</template>
