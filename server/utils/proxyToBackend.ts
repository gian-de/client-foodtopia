import { proxyRequest, type H3Event } from "h3";

let cachedDevBase: { base: string; expiresAt: number } | null = null;

function apiOrigins() {
  const config = useRuntimeConfig();
  const local = String(
    config.public.developmentApiUrl || "http://localhost:5001"
  ).replace(/\/$/, "");
  const remote = String(
    config.public.productionApiUrl || "https://api.foodiestopia.com"
  ).replace(/\/$/, "");
  return { local, remote };
}

async function resolveBackendBase() {
  const { local, remote } = apiOrigins();
  if (!import.meta.dev) return remote;

  if (cachedDevBase && Date.now() < cachedDevBase.expiresAt) {
    return cachedDevBase.base;
  }

  try {
    await fetch(`${local}/api/recipes?page=1&pageSize=1`, {
      signal: AbortSignal.timeout(400),
    });
    cachedDevBase = { base: local, expiresAt: Date.now() + 5000 };
    return local;
  } catch {
    cachedDevBase = { base: remote, expiresAt: Date.now() + 5000 };
    return remote;
  }
}

export async function proxyToBackend(event: H3Event) {
  const base = await resolveBackendBase();
  return proxyRequest(event, `${base}${event.path}`, {
    fetchOptions: { signal: AbortSignal.timeout(25_000) },
  });
}
