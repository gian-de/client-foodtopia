<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const auth = useAuthStore();
const isGuest = computed(() => auth.user?.role === "Guest");

const links = [
  { to: "/account/recipes", label: "Recipes", guestLocked: false },
  { to: "/account/playlists", label: "Playlists", guestLocked: true },
  { to: "/account/favorites", label: "Favorites", guestLocked: true },
  { to: "/account/submissions", label: "Submissions", guestLocked: true },
];
</script>

<template>
  <div class="px-6 py-10">
    <div class="max-w-5xl mx-auto space-y-6">
      <header class="space-y-2">
        <h1 class="text-2xl font-bold text-stone-900 sm:text-3xl">Dashboard</h1>
        <p class="text-stone-600">
          Create recipes and playlists, then submit them for review. A playlist
          can only include recipes that are already public.
        </p>
      </header>
      <nav
        class="inline-flex flex-wrap gap-1 p-1 bg-white border rounded-lg border-brand-100"
        aria-label="Account"
      >
        <template v-for="link in links" :key="link.to">
          <span v-if="isGuest && link.guestLocked" class="relative group">
            <button
              type="button"
              class="px-3 py-1.5 text-sm font-medium rounded-md cursor-not-allowed text-stone-400"
              aria-disabled="true"
            >
              {{ link.label }}
            </button>
            <span
              class="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-md bg-stone-900 px-3 py-2 text-xs font-medium text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
              role="tooltip"
            >
              Only verified users can access these links.
            </span>
          </span>
          <NuxtLink
            v-else
            :to="link.to"
            class="px-3 py-1.5 text-sm font-medium rounded-md text-stone-700 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            active-class="!bg-brand-600 !text-white"
          >
            {{ link.label }}
          </NuxtLink>
        </template>
      </nav>
      <NuxtPage />
    </div>
  </div>
</template>
