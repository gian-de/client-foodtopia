<script setup lang="ts">
import { ref, reactive } from "vue";

import { useAuthStore } from "@/stores/auth";

import EyeIcon from "@/components/svgs/EyeIcon.vue";
import EyeIconSlash from "@/components/svgs/EyeIconSlash.vue";

const auth = useAuthStore();

const registerForm = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const isLoading = ref(false);
const errorMessage = ref("");
const isPasswordHidden = ref(true);

async function showPassword() {
  isPasswordHidden.value = !isPasswordHidden.value;
  return;
}

async function onSubmitRegisterInfo() {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    if (!registerForm.username.trim()) throw new Error("Username is required.");
    if (registerForm.username.length < 3)
      throw new Error("Username must be at least 3 characters.");
    if (!registerForm.email.trim()) throw new Error("Email is required.");
    if (registerForm.email.length < 6)
      throw new Error("Email must be at least 6 characters.");
    if (!registerForm.password.trim()) throw new Error("Password is required.");
    if (registerForm.password.length < 6)
      throw new Error("Password must be at least 6 characters.");
    if (!/\d/.test(registerForm.password)) {
      throw new Error("Password must contain at least one number.");
    }
    if (!/[^a-zA-Z0-9]/.test(registerForm.password)) {
      throw new Error(
        "Password must contain at least one special character (!@#$%^&*)."
      );
    }
    if (!registerForm.confirmPassword.trim())
      throw new Error("Confirmed password is required.");
    if (registerForm.password !== registerForm.confirmPassword)
      throw new Error("Passwords don't match.");

    await auth.register({
      email: registerForm.email.toLowerCase().trim(),
      username: registerForm.username.trim(),
      password: registerForm.password.trim(),
    });
  } catch (err: any) {
    errorMessage.value = err.message || "Attempt to register failed.";
  } finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <div class="max-w-2xl mx-auto">
    <form
      @submit.prevent="onSubmitRegisterInfo"
      class="flex flex-col p-6 space-y-4 rounded-md shadow-md bg-zinc-200/80"
    >
      <div class="flex flex-col items-start justify-center w-full space-y-2">
        <label class="text-3xl" for="username">Username:</label>
        <input
          v-model="registerForm.username"
          :disabled="isLoading"
          id="username"
          name="username"
          type="text"
          class="flex items-center w-4/5 h-10 pl-2 text-2xl border rounded-md border-slate-800 bg-slate-50 focus:outline-green-600"
          placeholder="IronFist28"
        />
        <label class="text-3xl" for="email">Email:</label>
        <input
          v-model="registerForm.email"
          :disabled="isLoading"
          id="email"
          name="email"
          type="email"
          class="flex items-center w-4/5 h-10 pl-2 text-2xl border rounded-md border-slate-800 bg-slate-50 focus:outline-green-600"
          placeholder="email@example.com"
        />
      </div>
      <div class="flex flex-col items-start justify-center w-full space-y-2">
        <label class="text-3xl" for="password">Password:</label>
        <div class="relative flex items-center w-4/5 h-10">
          <div
            @click="showPassword"
            class="absolute px-2 cursor-pointer right-2"
          >
            <EyeIcon v-if="isPasswordHidden" />
            <EyeIconSlash v-else />
          </div>
          <input
            v-model="registerForm.password"
            :disabled="isLoading"
            id="password"
            name="password"
            :type="isPasswordHidden ? 'password' : 'text'"
            class="w-full pl-2 text-2xl border rounded-md border-slate-800 bg-slate-50 focus:outline-green-600"
            placeholder="************"
          />
        </div>
      </div>
      <div class="flex flex-col items-start justify-center w-full space-y-2">
        <label class="text-3xl" for="confirmPassword">Confirm Password:</label>
        <div class="relative flex items-center w-4/5 h-10">
          <div
            @click="showPassword"
            class="absolute px-2 cursor-pointer right-2"
          >
            <EyeIcon v-if="isPasswordHidden" />
            <EyeIconSlash v-else />
          </div>
          <input
            v-model="registerForm.confirmPassword"
            :disabled="isLoading"
            id="confirmPassword"
            name="confirmPassword"
            :type="isPasswordHidden ? 'password' : 'text'"
            class="w-full pl-2 text-2xl border rounded-md border-slate-800 bg-slate-50 focus:outline-green-600"
            placeholder="************"
          />
        </div>
      </div>
      <div
        v-if="errorMessage"
        class="p-3 text-red-600 bg-red-100 border border-red-300 rounded-md"
      >
        {{ errorMessage }}
      </div>
      <div class="flex items-center justify-between">
        <span>
          Already have an account? -
          <NuxtLink
            to="/login"
            class="text-xl italic underline transition cursor-pointer hover:text-green-600"
          >
            Login
          </NuxtLink>
        </span>
        <button
          v-if="isLoading"
          :disabled="isLoading"
          class="px-4 py-1 text-lg bg-green-800 rounded-md cursor-not-allowed text-slate-50 hover:bg-green-700"
        >
          Creating account...
        </button>
        <button
          v-else
          class="px-4 py-1 text-lg bg-green-600 rounded-md cursor-pointer text-slate-50 hover:bg-green-700"
        >
          Register
        </button>
      </div>
    </form>
    <div class="flex flex-col pt-8 mt-8 border-t-2 border-black">
      <h2 class="text-2xl">
        Or continue as a 'Guest' - keep in mind certain features are required to
        be signed in to utilize.
      </h2>
      <span class="pr-6 ml-auto">
        <NuxtLink
          class="px-4 py-1 transition border-2 border-green-600 rounded-md cursor-pointer w-fit hover:text-slate-50 hover:bg-green-600"
          >Login as guest</NuxtLink
        >
      </span>
    </div>
  </div>
</template>
