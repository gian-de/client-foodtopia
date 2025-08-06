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

  async function register(
    payload: { email: string; username: string; password: string },
    redirectTo?: string
  ) {
    console.log("=== REGISTER FUNCTION CALLED ===");
    console.log("payload:", payload);

    const url = `${baseUrl}/api/account/register`;

    try {
      const data = await $fetch(url, {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("POST method made", payload.email, payload.username);
      navigateTo(redirectTo);
    } catch (err: any) {
      console.log("=== CAUGHT ERROR IN AUTH STORE ===");
      console.log("err:", err);
      console.log("err.data:", err.data);
      console.log("========================");

      let errorMessage = "";

      //   const errorMessage = Array.isArray(err.data)
      //     ? err.data.map((e: any) => e.description || e.message).join(" ")
      //     : err.data?.message || err.data?.description || "Registration failed.";

      //   throw new Error(errorMessage);
      if (Array.isArray(err.data)) {
        console.log("It's an array");
        errorMessage = err.data
          .map((e: any) => e.description || e.message)
          .join(" ");
      } else if (err.data?.message) {
        console.log("It has a message property");
        errorMessage = err.data.message;
      } else if (err.data?.description) {
        console.log("It has a description property");
        errorMessage = err.data.description;
      } else {
        console.log("Using fallback");
        errorMessage = err.message || "Registration failed.";
      }

      console.log("Final error message:", errorMessage);
      throw new Error(errorMessage);
    }
  }
  return { user, token, isAuthenticated, login, clearAuth, logout, register };
});
