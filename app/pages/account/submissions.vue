<script setup lang="ts">
import { asRecord, pageItems, text } from "~/utils/json";
import { serverErrorMessage } from "~/utils/apiErrorMessage";

const { authFetch } = useAuthFetch();

const inputClass =
  "w-full px-4 py-2.5 text-base border rounded-md border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

const kind = ref<"recipes" | "playlists">("recipes");
const status = ref<"pending" | "denied" | "approved">("pending");
const items = ref<Record<string, unknown>[]>([]);
const history = ref<Record<string, unknown>[]>([]);
const lookupId = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const isLoading = ref(false);

function label(item: Record<string, unknown>) {
  return text(item, "name", "Name") || text(item, "visibilityStatus", "VisibilityStatus");
}

function itemId(item: Record<string, unknown>) {
  return text(item, "id", "Id", "recipeId", "RecipeId", "playlistId", "PlaylistId", "reviewId", "ReviewId");
}

async function load() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const path =
      kind.value === "recipes"
        ? `/api/recipes/submissions/${status.value}?page=1&pageSize=50`
        : `/api/playlists/submissions/${status.value}?page=1&pageSize=50`;
    items.value = pageItems(await authFetch(path));
  } catch (err) {
    errorMessage.value = serverErrorMessage(err);
    items.value = [];
  } finally {
    isLoading.value = false;
  }
}

async function onLookup() {
  errorMessage.value = "";
  successMessage.value = "";
  history.value = [];
  try {
    const data = await authFetch(`/api/recipes/${lookupId.value.trim()}/submissions`);
    const list = Array.isArray(data) ? data.map(asRecord) : pageItems(data);
    history.value = list.length ? list : [asRecord(data)];
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "No submission history for that recipe.";
  }
}

async function onSubmit(id: string) {
  errorMessage.value = "";
  successMessage.value = "";
  try {
    const path =
      kind.value === "recipes"
        ? `/api/recipes/${id}/submissions`
        : `/api/playlists/${id}/submissions`;
    await authFetch(path, { method: "POST" });
    successMessage.value = "Submitted for review.";
    await load();
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Could not submit.";
  }
}

watch([kind, status], load);
onMounted(load);
</script>

<template>
  <VerifiedGate>
    <div class="space-y-6">
      <section class="p-6 space-y-4 bg-white border rounded-lg border-stone-200">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-end">
          <SegmentedControl
            v-model="kind"
            name="submission-kind"
            label="Library"
            :options="[{ value: 'recipes', label: 'Recipes' }, { value: 'playlists', label: 'Playlists' }]"
          />
          <SegmentedControl
            v-model="status"
            name="submission-status"
            label="Status"
            :options="[{ value: 'pending', label: 'Pending' }, { value: 'denied', label: 'Denied' }, { value: 'approved', label: 'Approved' }]"
          />
        </div>
        <p v-if="isLoading" class="text-sm text-stone-500">Loading…</p>
        <EmptyState
          v-else-if="!items.length"
          title="Nothing here"
          description="Switch library or status, or submit a recipe or playlist from the other tabs."
        >
          <span class="text-sm font-semibold">0</span>
        </EmptyState>
        <ul v-else class="space-y-3">
          <li v-for="item in items" :key="itemId(item)" class="flex items-start justify-between gap-3">
            <div>
              <p class="font-medium text-stone-900">{{ label(item) }}</p>
              <p class="text-sm text-stone-500">{{ text(item, "visibilityStatus", "VisibilityStatus") }}</p>
            </div>
            <button type="button" class="text-sm font-medium text-brand-600" @click="onSubmit(itemId(item))">Submit</button>
          </li>
        </ul>
      </section>
      <form class="p-6 space-y-4 bg-white border rounded-lg border-stone-200" @submit.prevent="onLookup">
        <h2 class="text-lg font-semibold text-stone-900">Recipe review history</h2>
        <p class="text-sm text-stone-500">Look up a recipe by id to see earlier reviews.</p>
        <label class="block space-y-2 text-sm font-medium text-stone-700">
          Recipe id
          <input v-model="lookupId" required :class="inputClass" />
        </label>
        <button type="submit" class="px-5 py-2.5 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700">Look up</button>
        <ul v-if="history.length" class="space-y-3">
          <li v-for="(row, i) in history" :key="i">
            <p class="font-medium text-stone-900">{{ text(row, "visibilityStatus", "VisibilityStatus") }}</p>
            <p class="text-sm text-stone-500">
              {{ text(row, "visibilityFeedback", "VisibilityFeedback", "reviewFeedback", "ReviewFeedback") || "No comment" }}
              <span v-if="text(row, 'reviewedByUsername', 'ReviewedByUsername')">
                · {{ text(row, "reviewedByUsername", "ReviewedByUsername") }}
              </span>
            </p>
          </li>
        </ul>
      </form>
      <p v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">{{ errorMessage }}</p>
      <p v-if="successMessage" class="p-3 text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-md" role="status">{{ successMessage }}</p>
    </div>
  </VerifiedGate>
</template>
