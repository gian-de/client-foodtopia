<script setup lang="ts">
definePageMeta({ middleware: "admin" });

const links = [
  { to: "/admin", label: "Recipes" },
  { to: "/admin/playlists", label: "Playlists" },
];
</script>

<template>
  <div class="px-6 py-10">
    <div class="max-w-5xl mx-auto space-y-6">
      <header class="space-y-2">
        <h1 class="text-2xl font-bold text-stone-900 sm:text-3xl">Review queue</h1>
        <p class="text-stone-600">
          Approve or deny recipe and playlist submissions. A denied review needs a comment.
          Approving a recipe makes it public, which is required before it can join a public playlist.
        </p>
      </header>
      <nav
        class="inline-flex gap-1 p-1 bg-white border rounded-lg border-brand-100"
        aria-label="Review"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="px-3 py-1.5 text-sm font-medium rounded-md text-stone-700 hover:text-brand-700"
          exact-active-class="!bg-brand-600 !text-white"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
      <NuxtPage />
    </div>
  </div>
</template>
