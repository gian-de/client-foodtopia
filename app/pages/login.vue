<script setup lang="ts">
import LoginForm from "~/components/auth/LoginForm.vue";

definePageMeta({
  middleware: "guest",
});
</script>

<template>
  <div class="px-6 py-10">
    <section class="max-w-md mx-auto space-y-6">
      <header class="space-y-2 text-center">
        <h1
          class="text-2xl font-bold text-stone-900 sm:text-3xl"
        >
          Welcome back
        </h1>
        <p class="text-stone-600">
          Sign in to save recipes and rate dishes.
        </p>
      </header>
      <LoginForm />
    </section>
  </div>
</template>
