export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  // This ensures auth is initialized before any components render
  authStore.initAuth();
  authStore.authSyncCrossTab();
});
