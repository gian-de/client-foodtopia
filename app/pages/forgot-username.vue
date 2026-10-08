<script setup lang="ts">
import ForgotUsernameForm from "~/components/Auth/ForgotUsernameForm.vue";

definePageMeta({ middleware: "guest" });
</script>

<template>
  <div class="px-6 py-10">
    <section class="max-w-md mx-auto space-y-6">
      <header class="space-y-2 text-center">
        <h1 class="text-2xl font-bold text-stone-900 sm:text-3xl">Forgot your username?</h1>
        <p class="text-stone-600">
          Enter the email on your account. We’ll send the username you use to sign in.
        </p>
      </header>
      <ForgotUsernameForm />
    </section>
  </div>
</template>
