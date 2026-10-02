type ImageKitAuth = {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
};

export function useImageUpload() {
  const { authFetch } = useAuthFetch();

  async function uploadImage(file: File, folder: string) {
    if (!file.type.startsWith("image/")) throw new Error("Choose a photo.");
    if (file.size > 20 * 1024 * 1024) throw new Error("That photo is larger than 20 MB.");

    const auth = await authFetch<ImageKitAuth>("/api/media/imagekit-auth");
    const body = new FormData();
    body.append("file", file);
    body.append("fileName", file.name);
    body.append("publicKey", auth.publicKey);
    body.append("signature", auth.signature);
    body.append("expire", String(auth.expire));
    body.append("token", auth.token);
    body.append("folder", folder);
    body.append("useUniqueFileName", "true");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body,
    });
    const data = (await response.json().catch(() => null)) as { url?: string; message?: string } | null;
    if (!response.ok || !data?.url) {
      throw new Error(data?.message || "Could not upload that photo.");
    }
    return data.url;
  }

  return { uploadImage };
}
