<script setup lang="ts">
const auth = useAuthStore();
const isGuest = computed(() => auth.user?.role === "Guest");

const cards = [
  {
    to: "/account/recipes",
    title: "Recipes",
    text: "Create a recipe and submit it for review.",
    guestLocked: false,
  },
  {
    to: "/account/playlists",
    title: "Playlists",
    text: "Build a playlist from recipes that are already public.",
    guestLocked: true,
  },
  {
    to: "/account/favorites",
    title: "Favorites",
    text: "Hearted recipes and hearted playlists.",
    guestLocked: true,
  },
  {
    to: "/account/submissions",
    title: "Submissions",
    text: "Pending, denied, and approved reviews, plus denial comments.",
    guestLocked: true,
  },
];
</script>

<template>
  <section class="space-y-4">
    <p class="text-stone-700">
      Signed in as
      <span class="font-semibold text-stone-900">{{ auth.user?.username }}</span>.
    </p>
    <div class="grid gap-4 sm:grid-cols-2">
      <template v-for="card in cards" :key="card.to">
        <span
          v-if="isGuest && card.guestLocked"
          tabindex="0"
          class="relative block p-5 space-y-2 bg-stone-100 border rounded-lg cursor-not-allowed border-stone-200 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <h2 class="text-lg font-semibold text-stone-400">{{ card.title }}</h2>
          <p class="text-sm text-stone-400">{{ card.text }}</p>
          <span
            class="pointer-events-none absolute left-4 top-full z-20 mt-2 w-56 rounded-md bg-stone-900 px-3 py-2 text-xs font-medium text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
            role="tooltip"
          >
            Only verified users can access these links.
          </span>
        </span>
        <NuxtLink
          v-else
          :to="card.to"
          class="p-5 space-y-2 bg-white border rounded-lg border-brand-100 hover:border-brand-600"
        >
          <h2 class="text-lg font-semibold text-stone-900">{{ card.title }}</h2>
          <p class="text-sm text-stone-600">{{ card.text }}</p>
        </NuxtLink>
      </template>
    </div>
  </section>
</template>
