<script setup lang="ts">
import { apiErrorMessage } from "~/utils/apiErrorMessage";

definePageMeta({ middleware: "guest" });

const route = useRoute();
const { apiUrl } = useApiBase();

function queryValue(name: string) {
  const raw = route.query[name];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === "string" ? value : "";
}

const token = computed(() => queryValue("token"));
const email = computed(() => queryValue("email"));
const form = reactive({ password: "", confirmPassword: "" });
const errorMessage = ref("");
const notice = ref("");
const isSaving = ref(false);

const inputClass =
  "w-full px-4 py-2.5 text-base border rounded-md border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

function passwordProblem(value: string) {
  if (!value.trim()) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter.";
  if (!/\d/.test(value)) return "Password must contain at least one number.";
  if (!/[^a-zA-Z0-9]/.test(value)) return "Password must contain at least one special character.";
  return "";
}

async function onSubmit() {
  errorMessage.value = "";
  notice.value = "";
  if (!token.value || !email.value) {
    errorMessage.value = "This reset link is missing a token. Request a new one.";
    return;
  }
  const problem = passwordProblem(form.password);
  if (problem) {
    errorMessage.value = problem;
    return;
  }
  if (form.password !== form.confirmPassword) {
    errorMessage.value = "Passwords do not match.";
    return;
  }

  isSaving.value = true;
  try {
    const data = await $fetch<{ message?: string; Message?: string }>(apiUrl("/api/account/reset-password"), {
      method: "POST",
      body: {
        token: token.value,
        email: email.value,
        password: form.password,
      },
    });
    notice.value = data.message || data.Message || "Password has been reset. You can sign in.";
  } catch (err: unknown) {
    errorMessage.value = apiErrorMessage(err, "Could not reset the password. Request a new link.");
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="px-6 py-10">
    <section class="max-w-md mx-auto space-y-6">
      <header class="space-y-2 text-center">
        <h1 class="text-2xl font-bold text-stone-900 sm:text-3xl">Choose a new password</h1>
        <p class="text-stone-600">
          This link is only for
          <span class="font-medium text-stone-900">{{ email || "your account" }}</span>.
        </p>
      </header>
      <div class="p-6 space-y-4 bg-white border rounded-lg border-stone-200 sm:p-8">
        <p v-if="notice" class="text-sm text-stone-700" role="status">{{ notice }}</p>
        <form v-else class="space-y-4" @submit.prevent="onSubmit">
          <label class="block space-y-2 text-sm font-medium text-stone-700" for="password">
            New password
            <input id="password" v-model="form.password" type="password" autocomplete="new-password" required :class="inputClass" />
          </label>
          <label class="block space-y-2 text-sm font-medium text-stone-700" for="confirm-password">
            Confirm password
            <input id="confirm-password" v-model="form.confirmPassword" type="password" autocomplete="new-password" required :class="inputClass" />
          </label>
          <p v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">
            {{ errorMessage }}
          </p>
          <button
            type="submit"
            :disabled="isSaving"
            class="w-full px-5 py-2.5 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            {{ isSaving ? "Saving…" : "Reset password" }}
          </button>
        </form>
        <p class="text-sm text-center text-stone-600">
          <NuxtLink to="/login" class="font-medium text-brand-600 hover:text-brand-700">Back to sign in</NuxtLink>
        </p>
      </div>
    </section>
  </div>
</template>
