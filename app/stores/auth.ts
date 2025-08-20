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

  async function autoLogin(
    userData: { token: string; username: string; email: string },
    redirectTo?: string
  ) {
    token.value = userData.token;
    user.value = {
      username: userData.username,
      email: userData.email,
    };
    isAuthenticated.value = true;

    if (import.meta.client) {
      localStorage.setItem("authUser", JSON.stringify(user.value));
      localStorage.setItem("authToken", token.value);
    }
    await navigateTo(redirectTo ?? "/");
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

  async function register(payload: {
    email: string;
    username: string;
    password: string;
  }) {
    const url = `${baseUrl}/api/account/register`;

    try {
      const data = await $fetch(url, {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const redirectUrl = "/confirm-email";
      const emailParam = encodeURIComponent(payload.email);
      navigateTo(`${redirectUrl}?email=${emailParam}`);
    } catch (err: any) {
      let errorMessage = "";
      if (Array.isArray(err.data)) {
        errorMessage = err.data
          .map((e: any) => e.description || e.message)
          .join(" ");
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      } else if (err.data?.description) {
        errorMessage = err.data.description;
      } else {
        errorMessage = err.message || "Registration failed.";
      }
      throw new Error(errorMessage);
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    autoLogin,
    clearAuth,
    logout,
    register,
  };
});
