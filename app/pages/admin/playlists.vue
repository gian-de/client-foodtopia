<script setup lang="ts">
import { pageItems, text } from "~/utils/json";

const { authFetch } = useAuthFetch();
const items = ref<Record<string, unknown>[]>([]);
const feedback = reactive<Record<string, string>>({});
const errorMessage = ref("");
const isLoading = ref(false);

async function load() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    items.value = pageItems(await authFetch("/api/moderator/playlists/pending?page=1&pageSize=50"));
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Could not load the queue.";
  } finally {
    isLoading.value = false;
  }
}

async function review(id: string, visibilityStatus: "approved" | "denied") {
  errorMessage.value = "";
  try {
    await authFetch(`/api/moderator/playlists/${id}/submission`, {
      method: "POST",
      body: {
        visibilityStatus,
        reviewFeedback: visibilityStatus === "denied" ? feedback[id]?.trim() : null,
      },
    });
    await load();
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Review failed.";
  }
}

onMounted(load);
</script>

<template>
  <section class="p-6 space-y-4 bg-white border rounded-lg border-stone-200">
    <p v-if="isLoading" class="text-sm text-stone-500">Loading…</p>
    <p v-else-if="!items.length" class="text-sm text-stone-500">No pending playlists.</p>
    <ul v-else class="space-y-5">
      <li v-for="item in items" :key="text(item, 'id', 'Id')" class="space-y-3">
        <div>
          <p class="font-medium text-stone-900">{{ text(item, "name", "Name") }}</p>
          <p class="text-sm text-stone-500">{{ text(item, "id", "Id") }}</p>
        </div>
        <textarea v-model="feedback[text(item, 'id', 'Id')]" rows="2" class="w-full px-4 py-2.5 text-sm border rounded-md border-stone-300" placeholder="Required if you deny" />
        <div class="flex gap-2">
          <button type="button" class="px-4 py-2 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700" @click="review(text(item, 'id', 'Id'), 'approved')">Approve</button>
          <button type="button" class="px-4 py-2 text-sm font-medium rounded-md border border-stone-300 text-stone-700" @click="review(text(item, 'id', 'Id'), 'denied')">Deny</button>
        </div>
      </li>
    </ul>
    <p v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">{{ errorMessage }}</p>
  </section>
</template>
