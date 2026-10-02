export function field(raw: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    if (raw[key] !== undefined && raw[key] !== null) return raw[key];
  }
  return undefined;
}

export function asRecord(value: unknown) {
  return (value ?? {}) as Record<string, unknown>;
}

export function pageItems(data: unknown) {
  const raw = asRecord(data);
  const results = field(raw, "results", "Results");
  return Array.isArray(results) ? results.map(asRecord) : [];
}

export function pageCount(data: unknown) {
  const total = Number(field(asRecord(data), "totalPages", "TotalPages") ?? 1);
  return Number.isFinite(total) && total > 0 ? total : 1;
}

export function text(raw: Record<string, unknown>, ...keys: string[]) {
  const value = field(raw, ...keys);
  return value == null ? "" : String(value);
}
