<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const auth = useAuthStore();
const isGuest = computed(() => auth.user?.role === "Guest");

const links = [
  { to: "/change-username", label: "Change username" },
  { to: "/change-email", label: "Change email" },
  { to: "/change-password", label: "Change password" },
];
</script>

<template>
  <div class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-2xl font-bold text-stone-900">Settings</h1>
      <p class="text-stone-600">Update your login, or delete your account.</p>
    </header>

    <p v-if="isGuest" class="text-sm text-stone-600">
      Guest accounts cannot change a username, email, or password.
    </p>

    <ul class="overflow-hidden bg-white border divide-y rounded-lg border-stone-200 divide-stone-200">
      <template v-if="!isGuest">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="flex px-5 py-4 text-sm font-medium text-stone-900 hover:bg-stone-50 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </template>
      <li>
        <NuxtLink
          to="/delete-account"
          class="flex px-5 py-4 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          Delete account
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
