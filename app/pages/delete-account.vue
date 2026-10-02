<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const auth = useAuthStore();
const { authFetch } = useAuthFetch();

const inputClass =
  "w-full px-4 py-2.5 text-base border rounded-md border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

const confirmName = ref("");
const errorMessage = ref("");
const isDeleting = ref(false);
const currentUsername = computed(() => auth.user?.username ?? "");
const nameMatches = computed(
  () => confirmName.value.trim() === currentUsername.value && currentUsername.value.length > 0
);

async function onDeleteAccount() {
  if (!nameMatches.value) return;
  isDeleting.value = true;
  errorMessage.value = "";
  try {
    await authFetch("/api/account/delete-account", { method: "DELETE" });
    auth.logout();
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Could not delete the account.";
    isDeleting.value = false;
  }
}
</script>

<template>
  <div class="px-6 py-10">
    <section class="max-w-md mx-auto space-y-6">
      <header class="space-y-2">
        <NuxtLink to="/account/settings" class="text-sm font-medium text-brand-600 hover:text-brand-700">
          Back to settings
        </NuxtLink>
        <h1 class="text-2xl font-bold text-stone-900">Delete account</h1>
      </header>
      <form class="p-6 space-y-4 bg-white border rounded-lg border-red-200" @submit.prevent="onDeleteAccount">
        <p class="text-sm text-stone-600">
          This removes your login. It cannot be undone from this page.
        </p>
        <label class="block space-y-2 text-sm font-medium text-stone-700" for="confirm-username">
          Type <span class="font-semibold text-stone-900">{{ currentUsername }}</span> to confirm
          <input id="confirm-username" v-model="confirmName" autocomplete="off" :class="inputClass" />
        </label>
        <p v-if="errorMessage" class="text-sm text-red-700" role="alert">{{ errorMessage }}</p>
        <button
          type="submit"
          :disabled="!nameMatches || isDeleting"
          class="px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-md hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          {{ isDeleting ? "Deleting…" : "Delete my account" }}
        </button>
      </form>
    </section>
  </div>
</template>
