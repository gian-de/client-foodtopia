<script setup lang="ts">
import { computed } from "vue";

definePageMeta({ middleware: "guest" });

const route = useRoute();

const email = computed(() => decodeURIComponent(route.query.email as string));
</script>

<template>
  <div class="flex flex-col max-w-lg px-4 mx-auto mt-16 space-y-8">
    <p class="mx-auto text-xl sm:text-3xl">
      Verify your email: <span class="italic">{{ email }}</span> in order to
      utilize all the features inside of Foodtopia.
    </p>
    <NuxtLink
      to="/login"
      class="px-4 py-1 mx-auto text-center transition border rounded cursor-pointer w-fit border-stone-500 bg-stone-200 hover:bg-stone-300"
      >back to login page</NuxtLink
    >
  </div>
</template>
