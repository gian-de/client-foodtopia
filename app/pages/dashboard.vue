<script setup lang="ts">
definePageMeta({ middleware: "auth" });
await navigateTo("/account", { replace: true });
</script>

<template>
  <div />
</template>
