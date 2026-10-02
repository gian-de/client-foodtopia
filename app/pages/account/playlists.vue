<script setup lang="ts">
import { pageItems, text } from "~/utils/json";
import { serverErrorMessage } from "~/utils/apiErrorMessage";

const { authFetch } = useAuthFetch();

const inputClass =
  "w-full px-4 py-2.5 text-base border rounded-md border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

const playlists = ref<Record<string, unknown>[]>([]);
const errorMessage = ref("");
const successMessage = ref("");
const isLoading = ref(false);
const isSaving = ref(false);
const editingId = ref("");

const createForm = reactive({ name: "", slugText: "", slugNumber: 1 });
const editForm = reactive({ name: "", slugText: "", slugNumber: 1, recipeId: "" });

function idOf(item: Record<string, unknown>) {
  return text(item, "id", "Id", "playlistId", "PlaylistId");
}

async function load() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    playlists.value = pageItems(await authFetch("/api/playlists/my?page=1&pageSize=50"));
  } catch (err) {
    errorMessage.value = serverErrorMessage(err);
  } finally {
    isLoading.value = false;
  }
}

async function onCreate() {
  isSaving.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  try {
    await authFetch("/api/playlists", {
      method: "POST",
      body: {
        name: createForm.name.trim(),
        slugText: createForm.slugText.trim(),
        slugNumber: Number(createForm.slugNumber),
      },
    });
    successMessage.value = "Playlist created.";
    createForm.name = "";
    createForm.slugText = "";
    await load();
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Could not create the playlist.";
  } finally {
    isSaving.value = false;
  }
}

function startEdit(playlist: Record<string, unknown>) {
  editingId.value = idOf(playlist);
  editForm.name = text(playlist, "name", "Name");
  editForm.slugText = text(playlist, "fullSlug", "FullSlug").replace(/-\d+$/, "");
  editForm.slugNumber = 1;
  editForm.recipeId = "";
  errorMessage.value = "";
  successMessage.value = "";
}

async function onSaveEdit() {
  if (!editingId.value) return;
  isSaving.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  try {
    await authFetch(`/api/playlists/${editingId.value}`, {
      method: "PUT",
      body: {
        name: editForm.name.trim(),
        slugText: editForm.slugText.trim(),
        slugNumber: Number(editForm.slugNumber),
      },
    });
    successMessage.value = "Playlist updated.";
    await load();
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Could not update the playlist.";
  } finally {
    isSaving.value = false;
  }
}

async function onAddRecipe() {
  if (!editingId.value) return;
  isSaving.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  try {
    await authFetch(`/api/playlists/${editingId.value}`, {
      method: "POST",
      body: { recipeId: editForm.recipeId.trim() },
    });
    successMessage.value = "Recipe added. Only public recipes are allowed.";
    editForm.recipeId = "";
    await load();
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Could not add that recipe.";
  } finally {
    isSaving.value = false;
  }
}

async function onSubmitPlaylist(id: string) {
  isSaving.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  try {
    await authFetch(`/api/playlists/${id}/submissions`, { method: "POST" });
    successMessage.value = "Playlist submitted for review.";
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Could not submit that playlist.";
  } finally {
    isSaving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <VerifiedGate>
    <div class="grid gap-6 lg:grid-cols-2">
      <section class="p-6 space-y-4 bg-white border rounded-lg border-stone-200">
        <h2 class="text-lg font-semibold text-stone-900">Your playlists</h2>
        <p class="text-sm text-stone-500">
          Add a recipe only after a moderator has approved it. The API rejects anything that is not public.
        </p>
        <p v-if="isLoading" class="text-sm text-stone-500">Loading…</p>
        <EmptyState
          v-else-if="!playlists.length"
          title="No playlists yet"
          description="Create a playlist, then add recipes only after a moderator has made them public."
        >
          <span class="text-lg font-semibold">+</span>
        </EmptyState>
        <ul v-else class="space-y-3">
          <li v-for="playlist in playlists" :key="idOf(playlist)" class="flex items-center justify-between gap-3">
            <div>
              <p class="font-medium text-stone-900">{{ text(playlist, "name", "Name") }}</p>
              <p class="text-sm text-stone-500">
                {{ text(playlist, "visibilityStatus", "VisibilityStatus") }} ·
                {{ text(playlist, "recipeCount", "RecipeCount") || "0" }} recipes
              </p>
            </div>
            <div class="flex gap-3">
              <button type="button" class="text-sm font-medium text-brand-600 hover:text-brand-700" @click="onSubmitPlaylist(idOf(playlist))">
                Submit
              </button>
              <button type="button" class="text-sm font-medium text-brand-600 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" @click="startEdit(playlist)">
                Edit
              </button>
            </div>
          </li>
        </ul>
      </section>
      <div class="space-y-6">
        <form class="p-6 space-y-4 bg-white border rounded-lg border-stone-200" @submit.prevent="onCreate">
          <h2 class="text-lg font-semibold text-stone-900">Create a playlist</h2>
          <label class="block space-y-2 text-sm font-medium text-stone-700">
            Name
            <input v-model="createForm.name" required :class="inputClass" />
          </label>
          <div class="grid grid-cols-2 gap-3">
            <label class="block space-y-2 text-sm font-medium text-stone-700">
              Slug words
              <input v-model="createForm.slugText" required :class="inputClass" />
            </label>
            <label class="block space-y-2 text-sm font-medium text-stone-700">
              Number
              <input v-model.number="createForm.slugNumber" type="number" min="0" required :class="inputClass" />
            </label>
          </div>
          <button type="submit" :disabled="isSaving" class="w-full px-5 py-2.5 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:opacity-60">
            Create playlist
          </button>
        </form>
        <form v-if="editingId" class="p-6 space-y-4 bg-white border rounded-lg border-stone-200" @submit.prevent="onSaveEdit">
          <h2 class="text-lg font-semibold text-stone-900">Edit playlist</h2>
          <label class="block space-y-2 text-sm font-medium text-stone-700">
            Name
            <input v-model="editForm.name" required :class="inputClass" />
          </label>
          <div class="grid grid-cols-2 gap-3">
            <label class="block space-y-2 text-sm font-medium text-stone-700">
              Slug words
              <input v-model="editForm.slugText" required :class="inputClass" />
            </label>
            <label class="block space-y-2 text-sm font-medium text-stone-700">
              Number
              <input v-model.number="editForm.slugNumber" type="number" min="0" required :class="inputClass" />
            </label>
          </div>
          <button type="submit" :disabled="isSaving" class="w-full px-5 py-2.5 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:opacity-60">
            Save changes
          </button>
          <label class="block space-y-2 text-sm font-medium text-stone-700">
            Public recipe id
            <input v-model="editForm.recipeId" :class="inputClass" placeholder="Recipe GUID" />
          </label>
          <button type="button" :disabled="isSaving || !editForm.recipeId.trim()" class="w-full px-5 py-2.5 text-sm font-medium rounded-md border border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white disabled:opacity-60" @click="onAddRecipe">
            Add public recipe
          </button>
        </form>
        <p v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">{{ errorMessage }}</p>
        <p v-if="successMessage" class="p-3 text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-md" role="status">{{ successMessage }}</p>
      </div>
    </div>
  </VerifiedGate>
</template>
