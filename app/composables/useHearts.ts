import { pageItems, text } from "~/utils/json";

const recipeIds = ref<string[]>([]);
const playlistIds = ref<string[]>([]);
let loadedFor = "";
let loading: Promise<void> | null = null;

export function useHearts() {
  const auth = useAuthStore();
  const { authFetch } = useAuthFetch();

  const isVerified = computed(
    () => auth.isAuthenticated && auth.user?.role !== "Guest"
  );

  function identity() {
    return isVerified.value ? auth.user?.username ?? "" : "";
  }

  async function refresh() {
    const key = identity();
    if (!key) {
      recipeIds.value = [];
      playlistIds.value = [];
      loadedFor = "";
      return;
    }
    const [recipes, playlists] = await Promise.allSettled([
      authFetch("/api/recipes/hearted-recipes?page=1&pageSize=200"),
      authFetch("/api/playlists/hearted?page=1&pageSize=200"),
    ]);
    if (recipes.status === "fulfilled") {
      recipeIds.value = pageItems(recipes.value)
        .map((item) => text(item, "id", "Id"))
        .filter(Boolean);
    }
    if (playlists.status === "fulfilled") {
      playlistIds.value = pageItems(playlists.value)
        .map((item) => text(item, "id", "Id"))
        .filter(Boolean);
    }
    loadedFor = key;
  }

  function ensure() {
    const key = identity();
    if (!key) {
      recipeIds.value = [];
      playlistIds.value = [];
      loadedFor = "";
      return Promise.resolve();
    }
    if (loadedFor === key) return Promise.resolve();
    loading ??= refresh().finally(() => {
      loading = null;
    });
    return loading;
  }

  function has(kind: "recipe" | "playlist", id: string) {
    const list = kind === "recipe" ? recipeIds.value : playlistIds.value;
    return list.includes(id);
  }

  function setHas(kind: "recipe" | "playlist", id: string, on: boolean) {
    const list = kind === "recipe" ? recipeIds : playlistIds;
    if (on && !list.value.includes(id)) list.value = [...list.value, id];
    if (!on) list.value = list.value.filter((item) => item !== id);
  }

  async function toggle(kind: "recipe" | "playlist", id: string) {
    await ensure();
    const on = has(kind, id);
    if (kind === "recipe") {
      if (on) {
        await authFetch(`/api/recipes/hearted-recipes/${id}`, { method: "DELETE" });
      } else {
        await authFetch("/api/recipes/hearted-recipes", {
          method: "POST",
          body: { recipeId: id },
        });
      }
    } else if (on) {
      await authFetch(`/api/playlists/${id}/heart`, { method: "DELETE" });
    } else {
      await authFetch(`/api/playlists/${id}/heart`, { method: "POST" });
    }
    setHas(kind, id, !on);
    return !on;
  }

  return { isVerified, recipeIds, playlistIds, ensure, has, toggle };
}
