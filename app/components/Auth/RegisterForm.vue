<script setup lang="ts"></script>
<template>
  <div class="max-w-2xl mx-auto">
    <form
      action=""
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
        <label class="text-3xl" for="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          class="flex items-center w-4/5 h-10 pl-2 text-2xl border rounded-md border-slate-800 bg-slate-50 focus:outline-green-600"
          placeholder="email@example.com"
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
      <div class="flex flex-col items-start justify-center w-full space-y-2">
        <label class="text-3xl" for="passwordConfirmation"
          >Confirm Password:</label
        >
        <input
          id="passwordConfirmation"
          name="passwordConfirmation"
          type="password"
          required
          class="flex items-center w-4/5 h-10 pl-2 text-2xl border rounded-md border-slate-800 bg-slate-50 focus:outline-green-600"
          placeholder="************"
        />
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
    <div class="pb-[2000px]"></div>
  </div>
</template>
