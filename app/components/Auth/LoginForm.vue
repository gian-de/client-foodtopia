<script setup lang="ts">
import { ref } from "vue";

function onSubmitLoginForm() {}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <form
      @submit.prevent="onSubmitLoginForm"
      class="flex flex-col p-6 space-y-4 rounded-md shadow-md bg-gray-200/80"
    >
      <div class="flex flex-col items-start justify-center w-full space-y-2">
        <label class="text-3xl" for="username">Username:</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          class="flex items-center w-4/5 h-10 pl-2 text-2xl border rounded-md border-slate-800 bg-slate-50 focus:outline-green-600"
          placeholder="IronFist28"
        />
      </div>
      <div class="flex flex-col items-start justify-center w-full space-y-2">
        <label class="text-3xl" for="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          class="flex items-center w-4/5 h-10 pl-2 text-2xl border rounded-md border-slate-800 bg-slate-50 focus:outline-green-600"
          placeholder="************"
        />
      </div>
      <div class="flex items-center justify-between">
        <NuxtLink
          to="/forgot-password"
          class="px-4 py-1 transition border-2 border-green-600 rounded-md cursor-pointer hover:text-slate-50 hover:bg-green-600"
          >Forgot password</NuxtLink
        >
        <button
          class="px-4 py-1 text-lg bg-green-600 rounded-md cursor-pointer text-slate-50 hover:bg-green-700"
        >
          Login
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
