<script setup lang="ts">
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm.vue";
</script>

<template>
  <div class="flex flex-col mt-16 space-y-10">
    <h2 class="mx-auto text-2xl sm:text-4xl w-fit">
      Enter your email below, and we'll email you a link to reset your password
    </h2>
    <ForgotPasswordForm />
  </div>
</template>
