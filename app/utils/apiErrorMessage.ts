function flattenErrors(data: unknown): string[] {
  if (!data || typeof data !== "object") return [];

  if (Array.isArray(data)) {
    return data.flatMap((item) => {
      if (typeof item === "string") return [item];
      if (item && typeof item === "object") {
        const row = item as Record<string, unknown>;
        const text = row.description ?? row.Description ?? row.message ?? row.Message;
        return typeof text === "string" && text.trim() ? [text] : [];
      }
      return [];
    });
  }

  const body = data as Record<string, unknown>;
  if (body.errors && typeof body.errors === "object") {
    return Object.values(body.errors as Record<string, unknown>).flatMap((value) => {
      if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
      if (typeof value === "string") return [value];
      return [];
    });
  }

  return [];
}

export function apiErrorMessage(err: unknown, fallback: string) {
  const fetchErr = err as {
    data?: unknown;
    message?: string;
    statusMessage?: string;
  };

  const data = fetchErr.data ?? (fetchErr as { response?: { _data?: unknown } }).response?._data;
  if (typeof data === "string" && data.trim()) return data;

  if (data && typeof data === "object") {
    const body = data as Record<string, unknown>;
    const named = body.message ?? body.Message;
    if (typeof named === "string" && named.trim()) return named;

    const parts = flattenErrors(data);
    if (parts.length) return parts.join(" ");
  }

  const raw = (fetchErr.message || fetchErr.statusMessage || "").trim();
  const isGenericStatus =
    /^\[(GET|POST|PUT|PATCH|DELETE)\]/i.test(raw) ||
    /\b\d{3}\s+Bad Request\b/i.test(raw);

  if (raw && !isGenericStatus) return raw;
  return fallback;
}

export function serverErrorMessage(err: unknown) {
  const status = (err as { status?: number }).status ?? 0;
  if (status < 500) return "";
  return err instanceof Error ? err.message : "Something went wrong. Try again.";
}
