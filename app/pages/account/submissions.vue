<script setup lang="ts">
import EmptyState from "~/components/ui/EmptyState.vue";
import SegmentedControl from "~/components/ui/SegmentedControl.vue";
import { pageCount, pageItems, text } from "~/utils/json";
import { serverErrorMessage } from "~/utils/apiErrorMessage";

const { authFetch } = useAuthFetch();

const kind = ref<"recipes" | "playlists">("recipes");
const status = ref<"pending" | "denied" | "approved">("pending");
const page = ref(1);
const totalPages = ref(1);
const items = ref<Record<string, unknown>[]>([]);
const errorMessage = ref("");
const isLoading = ref(false);

const emptyCopy = computed(() => {
  if (status.value === "pending") {
    return "Pending submissions show up here after you send a recipe or playlist for review.";
  }
  if (status.value === "denied") {
    return "Denied submissions show up here, along with the reviewer’s comment.";
  }
  return "Approved submissions show up here once a reviewer publishes them.";
});

function itemId(item: Record<string, unknown>) {
  return text(item, "id", "Id", "recipeId", "RecipeId", "playlistId", "PlaylistId");
}

function itemHref(item: Record<string, unknown>) {
  if (kind.value === "playlists") {
    const slug = text(item, "fullSlug", "FullSlug");
    return slug ? `/playlists/${slug}` : "";
  }
  const id = itemId(item);
  return id ? `/recipes/${id}` : "";
}

function submittedOn(item: Record<string, unknown>) {
  const raw = text(item, "submittedAt", "SubmittedAt");
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
}

async function load() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const path =
      kind.value === "recipes"
        ? `/api/recipes/submissions/${status.value}`
        : `/api/playlists/submissions/${status.value}`;
    const data = await authFetch(
      `${path}?page=${page.value}&pageSize=15&sortBy=SubmittedAt&sortDirection=desc`
    );
    items.value = pageItems(data);
    totalPages.value = pageCount(data);
    if (page.value > totalPages.value) page.value = totalPages.value;
  } catch (err) {
    errorMessage.value = serverErrorMessage(err);
    items.value = [];
    totalPages.value = 1;
  } finally {
    isLoading.value = false;
  }
}

watch([kind, status], () => {
  if (page.value === 1) load();
  else page.value = 1;
});
watch(page, load, { immediate: true });
</script>

<template>
  <VerifiedGate>
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
        title="Nothing here yet"
        :description="emptyCopy"
      >
        <span class="text-lg font-semibold">+</span>
      </EmptyState>
      <ul v-else class="space-y-3">
        <li v-for="item in items" :key="itemId(item)" class="flex items-start justify-between gap-3">
          <div>
            <NuxtLink
              v-if="itemHref(item)"
              :to="itemHref(item)"
              class="font-medium text-brand-600 hover:text-brand-700"
            >
              {{ text(item, "name", "Name") || "Untitled" }}
            </NuxtLink>
            <p v-else class="font-medium text-stone-900">{{ text(item, "name", "Name") || "Untitled" }}</p>
            <p class="text-sm text-stone-500">
              {{ text(item, "visibilityStatus", "VisibilityStatus") }}
              <span v-if="submittedOn(item)"> · {{ submittedOn(item) }}</span>
            </p>
            <p
              v-if="text(item, 'visibilityFeedback', 'VisibilityFeedback', 'reviewFeedback', 'ReviewFeedback')"
              class="text-sm text-stone-600"
            >
              {{ text(item, "visibilityFeedback", "VisibilityFeedback", "reviewFeedback", "ReviewFeedback") }}
            </p>
          </div>
        </li>
      </ul>
      <div v-if="totalPages > 1" class="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          class="px-3 py-1.5 text-sm font-medium rounded-md border border-stone-300 text-stone-700 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          :disabled="page <= 1 || isLoading"
          @click="page -= 1"
        >
          Previous
        </button>
        <p class="text-sm text-stone-600">Page {{ page }} of {{ totalPages }}</p>
        <button
          type="button"
          class="px-3 py-1.5 text-sm font-medium rounded-md border border-stone-300 text-stone-700 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          :disabled="page >= totalPages || isLoading"
          @click="page += 1"
        >
          Next
        </button>
      </div>
      <p v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">
        {{ errorMessage }}
      </p>
    </section>
  </VerifiedGate>
</template>
