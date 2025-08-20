<script setup lang="ts">
import ForgotUsernameForm from "@/components/auth/ForgotUsernameForm.vue";
</script>

<template>
  <div class="flex flex-col mt-16 space-y-10">
    <h2 class="px-8 mx-auto text-2xl sm:text-4xl w-fit">
      Enter your email and we'll email you, your login username!
    </h2>
    <ForgotUsernameForm />
  </div>
</template>
