<script setup lang="ts">
import { reactive, ref } from "vue";

import { useAuthMethods } from "@/composables/useAuthMethods";

const auth = useAuthMethods();

const form = reactive({ email: "" });
const isLoading = ref(false);
const isSuccess = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

async function onSubmitForgotUsernameForm() {
  try {
    isLoading.value = true;
    errorMessage.value = "";
    isSuccess.value = false;

    if (!form.email.trim()) throw new Error("Email is required.");
    if (form.email.length < 6)
      throw new Error("Email must be at least 6 characters.");

    const result = await auth.forgotUsername(form.email);

    successMessage.value = result.message;
    isSuccess.value = true;
  } catch (err: any) {
    errorMessage.value =
      err.data ||
      err.message ||
      err.statusMessage ||
      "Emailing your username failed."; // Ordering is important obviously!
  } finally {
    isLoading.value = false;
  }
}

function goToLoginPage() {
  navigateTo("/login");
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <div
      v-if="isSuccess"
      class="flex flex-col items-center p-8 space-y-6 rounded-md shadow-md bg-green-50"
    >
      <h3 class="text-2xl font-semibold text-center text-green-800">
        {{ successMessage }}
      </h3>
      <button
        @click="goToLoginPage"
        class="px-6 py-3 text-lg text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
      >
        Go to Login
      </button>
    </div>
    <form
      v-else
      @submit.prevent="onSubmitForgotUsernameForm"
      class="flex flex-col w-full p-6 space-y-4 bg-gray-200 rounded-md shadow-md/80"
    >
      <div class="flex flex-col items-start justify-center w-full space-y-2">
        <label class="text-3xl" for="username">Email:</label>
        <input
          v-model="form.email"
          :disabled="isLoading"
          id="email"
          name="email"
          type="email"
          required
          class="flex w-4/5 h-10 pl-2 text-2xl border rounded-md border-slate-800 bg-slate-50 focus:outline-green-600"
          placeholder="example@email.com"
        />
      </div>

      <div
        v-if="errorMessage"
        class="p-3 text-red-600 bg-red-100 border border-red-300 rounded-md"
      >
        {{ errorMessage }}
      </div>
      <div class="flex items-center justify-between">
        <span>
          Need an account? -
          <NuxtLink
            to="/register"
            class="text-xl italic underline transition cursor-pointer hover:text-green-600"
          >
            Register
          </NuxtLink>
        </span>
        <button
          :disabled="isLoading"
          type="submit"
          class="px-4 py-1 text-lg bg-green-600 rounded-md cursor-pointer text-slate-50 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-500/70 disabled:text-black"
        >
          {{ isLoading ? "Sending username to email..." : "Submit" }}
        </button>
      </div>
    </form>
  </div>
</template>
