export function useAuthFetch() {
  const auth = useAuthStore();
  const { apiUrl } = useApiBase();

  async function authFetch<T>(path: string, options: Record<string, unknown> = {}) {
    const headers = {
      ...((options.headers as Record<string, string> | undefined) ?? {}),
      Authorization: `Bearer ${auth.token ?? ""}`,
    };

    try {
      return await $fetch<T>(apiUrl(path), { ...options, headers });
    } catch (err) {
      const status = (err as { status?: number; statusCode?: number }).status
        ?? (err as { statusCode?: number }).statusCode
        ?? 0;
      throw Object.assign(new Error(apiErrorMessage(err, "Request failed.")), { status });
    }
  }

  return { authFetch };
}
