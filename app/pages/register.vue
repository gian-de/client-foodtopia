<script setup lang="ts">
import RegisterForm from "~/components/auth/RegisterForm.vue";

definePageMeta({
  middleware: "guest",
});
</script>

<template>
  <div class="flex flex-col mt-16 space-y-10">
    <h2 class="mx-auto text-2xl sm:text-4xl w-fit">Create an account</h2>
    <RegisterForm />
  </div>
</template>
