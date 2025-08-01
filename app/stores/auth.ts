import { defineStore } from "pinia";
import { ref } from "vue";
import type { AuthResponse, AuthUser } from "~/types/auth_type";

export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.BASE_API_URL;

  const user = ref<AuthUser | null>(null);
  const token = ref<string | null>(null);

  async function login(
    payload: { username: string; password: string },
    redirectTo?: string
  ) {
    const url = `${baseUrl}/api/account/login`;

    // Send request
    const { data, error } = await useFetch<AuthResponse>(url, {
      method: "POST",
      body: payload,
      headers: { "Content-Type": "application/json" },
    });

    if (error.value) {
      console.error("Login error response data:", error.value);
      throw createError({
        statusCode: error.value.statusCode || 400,
        statusMessage: error.value.data?.message || "Login failed.",
        data: error.value.data,
      });
    }

    if (!data.value) {
      throw createError({
        statusCode: 500,
        statusMessage: "No response from the server.",
      });
    }

    token.value = data.value.jwtToken;
    user.value = {
      username: data.value.userName,
      email: data.value.email,
    };
    localStorage.setItem("authToken", token.value);
    navigateTo(redirectTo ?? "/");
  }
  return { user, token, login };
});
//   async function login(
//       payload: { username: string; password: string },
//       redirectTo?: string
//     ) {
//         try {
//             const url = `${baseUrl}/api/account/login`;
//             const response = await $fetch<AuthResponse>(url, {
//                 method: "POST",
//                 body: JSON.stringify(payload),
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             token.value = response.jwtToken;
//             user.value = {
//                 username: response.userName,
//                 email: response.email,
//             };

//             localStorage.setItem("authToken", token.value);
//             await navigateTo(redirectTo ?? "/");
//             return response;
//         } catch (err: any) {
//             const statusCode = err.response?.status ?? 500;
//             const statusMessage =
//             err.response?.data?.message || err.message || "Login failed";
//             throw createError({ statusCode, statusMessage });
//         }
//     }
//     return { login };
