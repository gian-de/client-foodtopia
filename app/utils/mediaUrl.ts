export function mediaUrl(baseUrl: string, path: string | null | undefined) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const relative = path.replace(/^\//, "");
  if (!baseUrl) return `/${relative}`;
  const origin = baseUrl.replace(/\/$/, "");
  return `${origin}/${relative}`;
}
