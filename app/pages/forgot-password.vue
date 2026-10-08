<script setup lang="ts">
import ForgotPasswordForm from "~/components/Auth/ForgotPasswordForm.vue";

definePageMeta({ middleware: "guest" });
</script>

<template>
  <div class="px-6 py-10">
    <section class="max-w-md mx-auto space-y-6">
      <header class="space-y-2 text-center">
        <h1 class="text-2xl font-bold text-stone-900 sm:text-3xl">Reset your password</h1>
        <p class="text-stone-600">
          Enter the email on your account. We’ll send a link to choose a new password.
        </p>
      </header>
      <ForgotPasswordForm />
    </section>
  </div>
</template>
