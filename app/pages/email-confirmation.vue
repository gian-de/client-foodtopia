<script setup>
import { ref, onMounted } from "vue";

import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const auth = useAuthStore();

const statusMessage = ref("Processing your email verification...");

onMounted(async () => {
  const { status, message, token, username, email } = route.query;

  if (status === "success" && token && username && email) {
    try {
      statusMessage.value =
        message || "Email confirmed! Logging you in one sec...";

      await auth.autoLogin(
        {
          token: decodeURIComponent(token),
          username: decodeURIComponent(username),
          email: decodeURIComponent(email),
        },
        "/"
      );
    } catch (error) {
      await navigateTo("/login");
    }
  } else {
    statusMessage.value = message;
  }
});
</script>
<template>
  <div class="w-full max-w-md space-y-8 text-center">
    <h2 class="text-3xl font-extrabold text-gray-900">Email Confirmation</h2>
    <p class="text-sm text-gray-600">
      {{ statusMessage }}
    </p>
  </div>
</template>
