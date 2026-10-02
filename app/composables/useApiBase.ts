function resolveApiOrigin() {
  const config = useRuntimeConfig();
  const developmentApiUrl = String(
    config.public.developmentApiUrl || "http://localhost:5001"
  ).replace(/\/$/, "");
  const productionApiUrl = String(
    config.public.productionApiUrl || "https://api.foodiestopia.com"
  ).replace(/\/$/, "");

  return import.meta.dev ? developmentApiUrl : productionApiUrl;
}

export function useApiBase() {
  const externalBase = resolveApiOrigin();

  // In dev, call same-origin `/api/*`. Nitro proxies that to localhost:5001.
  const apiBase = import.meta.dev ? "" : externalBase;
  const assetBase = import.meta.dev ? "" : externalBase;

  function apiUrl(path: string) {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return apiBase ? `${apiBase}${normalized}` : normalized;
  }

  return {
    apiBase,
    assetBase,
    apiUrl,
  };
}
