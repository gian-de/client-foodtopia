<script setup lang="ts">
import { useAuthMethods } from "~/composables/useAuthMethods";

const auth = useAuthMethods();

const form = reactive({ email: "" });
const isLoading = ref(false);
const isSuccess = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const inputClass =
  "w-full px-4 py-2.5 text-base border rounded-md border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

async function onSubmit() {
  isLoading.value = true;
  errorMessage.value = "";
  isSuccess.value = false;
  try {
    const result = await auth.forgotUsername(form.email.trim());
    successMessage.value = result.message;
    isSuccess.value = true;
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : "Could not send the username email.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="p-6 space-y-4 bg-white border rounded-lg border-stone-200 sm:p-8">
    <p v-if="isSuccess" class="text-sm text-stone-700" role="status">{{ successMessage }}</p>
    <form v-else class="space-y-4" @submit.prevent="onSubmit">
      <label class="block space-y-2 text-sm font-medium text-stone-700" for="email">
        Email
        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          required
          :disabled="isLoading"
          :class="inputClass"
          placeholder="you@email.com"
        />
      </label>
      <p v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">
        {{ errorMessage }}
      </p>
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full px-5 py-2.5 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {{ isLoading ? "Sending…" : "Email my username" }}
      </button>
    </form>
    <p class="text-sm text-center text-stone-600">
      <NuxtLink to="/login" class="font-medium text-brand-600 hover:text-brand-700">Back to sign in</NuxtLink>
    </p>
  </div>
</template>
