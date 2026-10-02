<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const auth = useAuthStore();
const { authFetch } = useAuthFetch();

const inputClass =
  "w-full px-4 py-2.5 text-base border rounded-md border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

const email = ref(auth.user?.email ?? "");
const errorMessage = ref("");
const notice = ref("");
const isSaving = ref(false);
const isGuest = computed(() => auth.user?.role === "Guest");

async function onSubmit() {
  isSaving.value = true;
  errorMessage.value = "";
  notice.value = "";
  const next = email.value.trim();
  if (!next.includes("@")) {
    errorMessage.value = "Enter a valid email address.";
    isSaving.value = false;
    return;
  }
  try {
    const data = await authFetch<{ email?: string; message?: string }>("/api/account/email", {
      method: "PUT",
      body: { email: next },
    });
    const saved = data.email || next;
    email.value = saved;
    auth.updateUser({ email: saved });
    notice.value = data.message || "Email updated. Confirm it from your inbox before your next sign-in.";
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Could not update the email.";
  } finally {
    isSaving.value = false;
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
        <h1 class="text-2xl font-bold text-stone-900">Change email</h1>
        <p class="text-sm text-stone-600">
          A confirmation link is sent to the new address. Sign-in uses that address only after you confirm it.
        </p>
      </header>
      <p v-if="isGuest" class="text-sm text-stone-600">
        Guest accounts cannot change an email.
      </p>
      <form v-else class="p-6 space-y-4 bg-white border rounded-lg border-stone-200" @submit.prevent="onSubmit">
        <label class="block space-y-2 text-sm font-medium text-stone-700" for="settings-email">
          New email
          <input id="settings-email" v-model="email" type="email" autocomplete="email" required :class="inputClass" />
        </label>
        <p v-if="errorMessage" class="text-sm text-red-700" role="alert">{{ errorMessage }}</p>
        <p v-if="notice" class="text-sm text-stone-600" role="status">{{ notice }}</p>
        <button
          type="submit"
          :disabled="isSaving"
          class="px-4 py-2 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          {{ isSaving ? "Saving…" : "Save email" }}
        </button>
      </form>
    </section>
  </div>
</template>
