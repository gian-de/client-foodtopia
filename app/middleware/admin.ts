export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();
  if (!auth.isAuthenticated) return navigateTo("/login");

  const role = auth.user?.role ?? "";
  if (!["Owner", "Senior Admin", "Admin"].includes(role)) {
    return navigateTo("/account");
  }
});
