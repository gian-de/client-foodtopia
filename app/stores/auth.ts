import { defineStore } from "pinia";
import { ref } from "vue";
import type { AuthResponse, AuthUser } from "~/types/auth_type";

export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.BASE_API_URL;

  const user = ref<AuthUser | null>(null);
  const token = ref<string | null>(null);
  const isAuthenticated = ref(false);

  async function login(
    payload: { username: string; password: string },
    redirectTo?: string
  ) {
    const url = `${baseUrl}/api/account/login`;
    try {
      const data = await $fetch<AuthResponse>(url, {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      token.value = data.jwtToken;
      user.value = {
        username: data.userName,
        email: data.email,
      };

      isAuthenticated.value = true;

      if (import.meta.client) {
        localStorage.setItem("authUser", JSON.stringify(user.value));
        localStorage.setItem("authToken", token.value);
      }

      await navigateTo(redirectTo ?? "/");
    } catch (err: any) {
      const statusCode = err.status ?? 500;
      const statusMessage = err.message || "Login failed";

      throw createError({ statusCode, statusMessage, data: err.data });
    }
  }

  function clearAuth() {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;

    if (import.meta.client) {
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
    }
  }

  function logout() {
    clearAuth();
    navigateTo("/");
  }
  return { user, token, isAuthenticated, login, clearAuth, logout };
});
