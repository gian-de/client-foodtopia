<script setup lang="ts">
import { NuxtLink } from "#components";
import CogIcon from "~/components/svgs/CogIcon.vue";

const navAuthLinks = [
  { id: 1, name: "Register", to: "/register" },
  { id: 2, name: "Login", to: "/login" },
];

const auth = useAuthStore();
const route = useRoute();
const { isAuthenticated, user } = storeToRefs(auth);
const onSettings = computed(() => route.path.startsWith("/account/settings"));
const isModerator = computed(() =>
  ["Owner", "Senior Admin", "Admin"].includes(user.value?.role ?? "")
);

function onClickSignOut() {
  auth.logout();
}
</script>

<template>
  <nav class="sticky top-0 z-30 px-6 py-4 bg-white border-b-2 border-brand-600/30">
    <div class="flex items-center justify-between max-w-6xl mx-auto">
      <NuxtLink
        to="/"
        class="text-2xl font-bold tracking-tight text-brand-600 transition-colors hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        Foodiestopia
      </NuxtLink>
      <ClientOnly>
        <div class="flex items-center gap-4 text-sm font-medium text-stone-700">
          <template v-if="isAuthenticated">
            <NuxtLink
              to="/account"
              class="transition-colors hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              active-class="!text-brand-600"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              v-if="isModerator"
              to="/admin"
              class="transition-colors hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              active-class="!text-brand-600"
            >
              Review
            </NuxtLink>
            <NuxtLink
              to="/account/settings"
              class="inline-flex hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              :class="onSettings ? 'text-brand-600' : ''"
              aria-label="Settings"
              :aria-current="onSettings ? 'page' : undefined"
            >
              <CogIcon />
            </NuxtLink>
            <button
              type="button"
              class="transition-colors hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              @click="onClickSignOut"
            >
              Sign out
            </button>
          </template>
          <template v-else>
            <NuxtLink
              v-for="link in navAuthLinks"
              :key="link.id"
              :to="link.to"
              class="transition-colors hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              active-class="!text-brand-600"
            >
              {{ link.name }}
            </NuxtLink>
          </template>
        </div>
      </ClientOnly>
    </div>
  </nav>
</template>
