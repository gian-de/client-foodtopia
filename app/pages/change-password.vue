<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const auth = useAuthStore();
const { authFetch } = useAuthFetch();

const inputClass =
  "w-full px-4 py-2.5 text-base border rounded-md border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

const form = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const errorMessage = ref("");
const notice = ref("");
const isSaving = ref(false);
const isGuest = computed(() => auth.user?.role === "Guest");

function passwordProblem(value: string) {
  if (!value.trim()) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter.";
  if (!/\d/.test(value)) return "Password must contain at least one number.";
  if (!/[^a-zA-Z0-9]/.test(value))
    return "Password must contain at least one special character (!@#$%^&*).";
  return "";
}

async function onSubmit() {
  isSaving.value = true;
  errorMessage.value = "";
  notice.value = "";
  const problem = passwordProblem(form.newPassword);
  if (!form.currentPassword.trim()) errorMessage.value = "Current password is required.";
  else if (problem) errorMessage.value = problem;
  else if (form.newPassword !== form.confirmPassword) errorMessage.value = "Passwords do not match.";
  if (errorMessage.value) {
    isSaving.value = false;
    return;
  }
  try {
    await authFetch("/api/account/password", {
      method: "PUT",
      body: {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      },
    });
    form.currentPassword = "";
    form.newPassword = "";
    form.confirmPassword = "";
    notice.value = "Password updated.";
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Could not update the password.";
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
        <h1 class="text-2xl font-bold text-stone-900">Change password</h1>
      </header>
      <p v-if="isGuest" class="text-sm text-stone-600">
        Guest accounts cannot change a password.
      </p>
      <form v-else class="p-6 space-y-4 bg-white border rounded-lg border-stone-200" @submit.prevent="onSubmit">
        <label class="block space-y-2 text-sm font-medium text-stone-700" for="current-password">
          Current password
          <input id="current-password" v-model="form.currentPassword" type="password" autocomplete="current-password" required :class="inputClass" />
        </label>
        <label class="block space-y-2 text-sm font-medium text-stone-700" for="new-password">
          New password
          <input id="new-password" v-model="form.newPassword" type="password" autocomplete="new-password" required :class="inputClass" />
        </label>
        <label class="block space-y-2 text-sm font-medium text-stone-700" for="confirm-password">
          Confirm new password
          <input id="confirm-password" v-model="form.confirmPassword" type="password" autocomplete="new-password" required :class="inputClass" />
        </label>
        <p v-if="errorMessage" class="text-sm text-red-700" role="alert">{{ errorMessage }}</p>
        <p v-if="notice" class="text-sm text-stone-600" role="status">{{ notice }}</p>
        <button
          type="submit"
          :disabled="isSaving"
          class="px-4 py-2 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          {{ isSaving ? "Saving…" : "Save password" }}
        </button>
      </form>
    </section>
  </div>
</template>
