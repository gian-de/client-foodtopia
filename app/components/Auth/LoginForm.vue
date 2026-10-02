<script setup lang="ts">
import { reactive, ref } from "vue";

import { useAuthStore } from "@/stores/auth";

import EyeIcon from "@/components/svgs/EyeIcon.vue";
import EyeIconSlash from "@/components/svgs/EyeIconSlash.vue";

const auth = useAuthStore();

const form = reactive({ username: "", password: "" });
const isLoading = ref(false);
const errorMessage = ref("");
const isPasswordHidden = ref(true);

const inputClass =
  "w-full px-4 py-2.5 text-base border rounded-md border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

async function onSubmitLoginForm() {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    if (!form.username.trim()) throw new Error("Username is required.");
    if (form.username.length < 3)
      throw new Error("Username must be at least 3 characters.");
    if (form.username.length > 50)
      throw new Error("Username cannot be more than 50 characters.");
    if (!form.password.trim()) throw new Error("Password is required.");
    if (form.password.length < 6)
      throw new Error("Password must be at least 6 characters.");
    if (form.password.length > 100)
      throw new Error("Password cannot be more than 100 characters.");

    await auth.login({ username: form.username, password: form.password });
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : "Login failed.";
  } finally {
    isLoading.value = false;
  }
}

function togglePassword() {
  isPasswordHidden.value = !isPasswordHidden.value;
}

async function onGuestLogin() {
  try {
    isLoading.value = true;
    errorMessage.value = "";
    await auth.guestLogin();
  } catch (err: any) {
    errorMessage.value =
      err.data || err.message || err.statusMessage || "Guest login failed.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <form
      class="p-6 space-y-5 bg-white border rounded-lg border-stone-200 sm:p-8"
      @submit.prevent="onSubmitLoginForm"
    >
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label
            class="text-sm font-medium text-stone-700"
            for="username"
          >
            Username
          </label>
          <NuxtLink
            to="/forgot-username"
            class="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Forgot username?
          </NuxtLink>
        </div>
        <input
          id="username"
          v-model="form.username"
          :disabled="isLoading"
          name="username"
          type="text"
          required
          :class="inputClass"
          placeholder="IronFist28"
        />
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label
            class="text-sm font-medium text-stone-700"
            for="password"
          >
            Password
          </label>
          <NuxtLink
            to="/forgot-password"
            class="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Forgot password?
          </NuxtLink>
        </div>
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :disabled="isLoading"
            name="password"
            :type="isPasswordHidden ? 'password' : 'text'"
            required
            :class="inputClass"
            placeholder="••••••••"
          />
          <button
            type="button"
            class="absolute p-1 text-stone-500 right-3 top-1/2 -translate-y-1/2 hover:text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            :aria-label="isPasswordHidden ? 'Show password' : 'Hide password'"
            @click="togglePassword"
          >
            <EyeIcon v-if="isPasswordHidden" />
            <EyeIconSlash v-else />
          </button>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md"
        role="alert"
      >
        {{ errorMessage }}
      </div>

      <button
        :disabled="isLoading"
        type="submit"
        class="w-full px-5 py-2.5 text-sm font-medium text-white transition-colors rounded-md bg-brand-600 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {{ isLoading ? "Logging in..." : "Sign in" }}
      </button>

      <p class="text-sm text-center text-stone-600">
        Need an account?
        <NuxtLink
          to="/register"
          class="font-medium text-brand-600 hover:text-brand-700"
        >
          Register
        </NuxtLink>
      </p>
    </form>

    <div
      class="p-6 space-y-4 bg-white border rounded-lg border-stone-200 sm:p-8"
    >
      <h2 class="text-base font-semibold text-stone-900">
        Continue as a guest
      </h2>
      <p class="text-sm text-stone-600">
        Browse recipes without an account. Some features require signing in.
      </p>
      <button
        type="button"
        :disabled="isLoading"
        class="w-full px-5 py-2.5 text-sm font-medium transition-colors rounded-md border border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        @click="onGuestLogin"
      >
        {{ isLoading ? "Logging in..." : "Continue as guest" }}
      </button>
    </div>
  </div>
</template>
