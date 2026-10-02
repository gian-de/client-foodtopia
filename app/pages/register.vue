<script setup lang="ts">
import RegisterForm from "~/components/auth/RegisterForm.vue";

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
          Create an account
        </h1>
        <p class="text-stone-600">
          Join Foodiestopia to heart recipes and share your own.
        </p>
      </header>
      <RegisterForm />
    </section>
  </div>
</template>
