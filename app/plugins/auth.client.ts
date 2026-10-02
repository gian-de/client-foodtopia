export default defineNuxtPlugin(() => {
  document.documentElement.classList.remove("dark");
  localStorage.removeItem("theme");

  const authStore = useAuthStore();

  // This ensures auth is initialized before any components render
  authStore.initAuth();
  authStore.authSyncCrossTab();
});
