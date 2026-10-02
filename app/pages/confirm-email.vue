<script setup lang="ts">
import { apiErrorMessage } from "~/utils/apiErrorMessage";

definePageMeta({ middleware: "guest" });

const route = useRoute();
const { apiUrl } = useApiBase();

const email = computed(() => {
  const raw = route.query.email;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
});

const notice = ref("");
const errorMessage = ref("");
const isResending = ref(false);

const inputClass =
  "w-full px-4 py-2.5 text-base border rounded-md border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

async function resendConfirmation() {
  notice.value = "";
  errorMessage.value = "";
  const address = email.value.toLowerCase().trim();
  if (!address) {
    errorMessage.value = "Email is required.";
    return;
  }
  isResending.value = true;
  try {
    const data = await $fetch<{ message?: string; Message?: string }>(
      apiUrl("/api/account/resend-email-confirmation"),
      { method: "POST", body: { email: address } }
    );
    notice.value =
      data.message ||
      data.Message ||
      "If that email is registered and unconfirmed, a new link is on its way.";
  } catch (err: unknown) {
    errorMessage.value = apiErrorMessage(err, "Could not resend the confirmation email.");
  } finally {
    isResending.value = false;
  }
}
</script>

<template>
  <div class="px-6 py-10">
    <section class="max-w-md mx-auto space-y-6">
      <header class="space-y-2 text-center">
        <h1 class="text-2xl font-bold text-stone-900 sm:text-3xl">Check your email</h1>
        <p class="text-stone-600">
          We sent a confirmation link to
          <span class="font-medium text-stone-900">{{ email || "your inbox" }}</span>.
          Open it before you sign in.
        </p>
      </header>

      <div class="p-6 space-y-4 bg-white border rounded-lg border-stone-200 sm:p-8">
        <h2 class="text-base font-semibold text-stone-900">Didn't get the email?</h2>
        <p class="text-sm text-stone-600">
          Check spam, or send the confirmation link again.
        </p>
        <p v-if="notice" class="text-sm text-stone-700" role="status">{{ notice }}</p>
        <p v-if="errorMessage" class="text-sm text-red-700" role="alert">{{ errorMessage }}</p>
        <button
          type="button"
          :disabled="isResending || !email"
          class="w-full px-5 py-2.5 text-sm font-medium transition-colors rounded-md border border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          @click="resendConfirmation"
        >
          {{ isResending ? "Sending…" : "Resend confirmation email" }}
        </button>
      </div>

      <p class="text-sm text-center text-stone-600">
        <NuxtLink to="/login" class="font-medium text-brand-600 hover:text-brand-700">
          Back to sign in
        </NuxtLink>
      </p>
    </section>
  </div>
</template>
