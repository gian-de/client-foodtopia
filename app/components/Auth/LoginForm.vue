<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const form = reactive({ username: "", password: "" });
const isLoading = ref(false);
const errorMessage = ref("");

async function onSubmitLoginForm() {
  try {
    isLoading.value = true;
    errorMessage.value = "";
    console.log("FORM:", form);
    await auth.login(
      { username: form.username, password: form.password },
      form.username
    );
  } catch (err: any) {
    console.log(err, "inside login form component");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <form
      @submit.prevent="onSubmitLoginForm"
      class="flex flex-col p-6 space-y-4 rounded-md shadow-md bg-gray-200/80"
    >
      <div
        v-if="errorMessage"
        class="p-3 text-red-600 bg-red-100 border border-red-300 rounded-md"
      >
        {{ errorMessage }}
      </div>
      <div v-if="auth.user" class="p-4 mt-4 bg-green-300 rounded-md">
        <p>Logged in as: {{ auth.user.username }}</p>
        <p>Email: {{ auth.user.email }}</p>
      </div>
      <div class="flex flex-col items-start justify-center w-full space-y-2">
        <label class="text-3xl" for="username">Username:</label>
        <input
          v-model="form.username"
          :disabled="isLoading"
          id="username"
          name="username"
          type="text"
          required
          class="flex items-center w-4/5 h-10 pl-2 text-2xl border rounded-md border-slate-800 bg-slate-50 focus:outline-green-600"
          placeholder="IronFist28"
        />
      </div>
      <div class="flex flex-col items-start justify-center w-full space-y-2">
        <div class="flex items-end justify-between w-full">
          <label class="text-3xl" for="password">Password:</label>
          <NuxtLink
            to="/forgot-password"
            class="px-4 py-1 text-sm italic underline transition rounded-md cursor-pointer hover:text-green-600"
            >Forgot password?</NuxtLink
          >
        </div>
        <input
          v-model="form.password"
          :disabled="isLoading"
          id="password"
          name="password"
          type="password"
          required
          class="flex items-center w-4/5 h-10 pl-2 text-2xl border rounded-md border-slate-800 bg-slate-50 focus:outline-green-600"
          placeholder="************"
        />
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
          class="px-4 py-1 text-lg bg-green-600 rounded-md cursor-pointer text-slate-50 hover:bg-green-700"
        >
          {{ isLoading ? "Logging in..." : "Login" }}
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
