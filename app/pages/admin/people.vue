<script setup lang="ts">
import { pageItems, text } from "~/utils/json";

definePageMeta({ middleware: "admin" });

const auth = useAuthStore();
const { authFetch } = useAuthFetch();

if (auth.user && auth.user.role !== "Owner") {
  await navigateTo("/admin");
}

const inputClass =
  "w-full px-4 py-2.5 text-base border rounded-md border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

type StaffUser = { id: string; username: string; email: string; role: string };

const query = ref("");
const found = ref<StaffUser | null>(null);
const seniorAdmins = ref<Record<string, unknown>[]>([]);
const admins = ref<Record<string, unknown>[]>([]);
const confirmName = ref("");
const errorMessage = ref("");
const notice = ref("");
const isSearching = ref(false);
const isSaving = ref(false);

const nameMatches = computed(
  () => found.value !== null && confirmName.value.trim() === found.value.username
);

function asUser(raw: Record<string, unknown>): StaffUser {
  return {
    id: text(raw, "id", "Id"),
    username: text(raw, "username", "Username"),
    email: text(raw, "email", "Email"),
    role: text(raw, "role", "Role") || "User",
  };
}

async function loadStaff() {
  const [seniorResult, adminResult] = await Promise.allSettled([
    authFetch("/api/senior-admin/senior-admins?page=1&pageSize=50"),
    authFetch("/api/senior-admin/non-senior-admins?page=1&pageSize=50"),
  ]);
  seniorAdmins.value = seniorResult.status === "fulfilled" ? pageItems(seniorResult.value) : [];
  admins.value = adminResult.status === "fulfilled" ? pageItems(adminResult.value) : [];
}

async function onSearch() {
  const username = query.value.trim();
  errorMessage.value = "";
  notice.value = "";
  found.value = null;
  confirmName.value = "";
  if (!username) {
    errorMessage.value = "Username is required.";
    return;
  }
  isSearching.value = true;
  try {
    found.value = asUser(
      await authFetch<Record<string, unknown>>(
        `/api/owner/users?username=${encodeURIComponent(username)}`
      )
    );
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "User not found.";
  } finally {
    isSearching.value = false;
  }
}

async function runAction(label: string, request: () => Promise<unknown>) {
  if (!found.value) return;
  isSaving.value = true;
  errorMessage.value = "";
  notice.value = "";
  try {
    await request();
    await onSearch();
    await loadStaff();
    notice.value = label;
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "That change failed.";
  } finally {
    isSaving.value = false;
  }
}

function promoteAdmin() {
  if (!found.value) return;
  return runAction("Promoted to admin.", () =>
    authFetch("/api/senior-admin/admins", { method: "POST", body: { userId: found.value!.id } })
  );
}

function promoteSenior() {
  if (!found.value) return;
  return runAction("Promoted to senior admin.", () =>
    authFetch("/api/owner/promote-to-senior-admin", { method: "POST", body: { userId: found.value!.id } })
  );
}

function demoteToAdmin() {
  if (!found.value) return;
  return runAction("Demoted to admin.", () =>
    authFetch(`/api/owner/demote-to-admin/${found.value!.id}`, { method: "DELETE" })
  );
}

function demoteToUser() {
  if (!found.value) return;
  return runAction("Demoted to a regular user.", () =>
    authFetch(`/api/senior-admin/admins/${found.value!.id}`, { method: "DELETE" })
  );
}

async function onDelete() {
  if (!found.value || !nameMatches.value) return;
  isSaving.value = true;
  errorMessage.value = "";
  notice.value = "";
  try {
    await authFetch(`/api/owner/users/${found.value.id}`, { method: "DELETE" });
    notice.value = "Account deleted.";
    found.value = null;
    confirmName.value = "";
    query.value = "";
    await loadStaff();
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Could not delete that account.";
  } finally {
    isSaving.value = false;
  }
}

onMounted(loadStaff);
</script>

<template>
  <div class="space-y-6">
    <section class="p-6 space-y-4 bg-white border rounded-lg border-stone-200">
      <h2 class="text-lg font-semibold text-stone-900">Find a user</h2>
      <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="onSearch">
        <label class="flex-1 space-y-2 text-sm font-medium text-stone-700" for="staff-username">
          Username
          <input id="staff-username" v-model="query" required :class="inputClass" />
        </label>
        <button
          type="submit"
          :disabled="isSearching"
          class="self-end px-5 py-2.5 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          {{ isSearching ? "Searching…" : "Search" }}
        </button>
      </form>

      <div v-if="found" class="pt-2 space-y-4">
        <div>
          <p class="font-medium text-stone-900">{{ found.username }}</p>
          <p class="text-sm text-stone-500">{{ found.email }} · {{ found.role }}</p>
        </div>
        <div v-if="found.role !== 'Owner'" class="flex flex-wrap gap-2">
          <button
            v-if="found.role !== 'Admin' && found.role !== 'Senior Admin'"
            type="button"
            :disabled="isSaving"
            class="px-4 py-2 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:opacity-60"
            @click="promoteAdmin"
          >
            Make admin
          </button>
          <button
            v-if="found.role !== 'Senior Admin'"
            type="button"
            :disabled="isSaving"
            class="px-4 py-2 text-sm font-medium rounded-md border border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white disabled:opacity-60"
            @click="promoteSenior"
          >
            Make senior admin
          </button>
          <button
            v-if="found.role === 'Senior Admin'"
            type="button"
            :disabled="isSaving"
            class="px-4 py-2 text-sm font-medium rounded-md border border-stone-300 text-stone-700 hover:text-brand-700 disabled:opacity-60"
            @click="demoteToAdmin"
          >
            Demote to admin
          </button>
          <button
            v-if="found.role === 'Admin'"
            type="button"
            :disabled="isSaving"
            class="px-4 py-2 text-sm font-medium rounded-md border border-stone-300 text-stone-700 hover:text-brand-700 disabled:opacity-60"
            @click="demoteToUser"
          >
            Demote to user
          </button>
        </div>
        <form
          v-if="found.role !== 'Owner'"
          class="max-w-md pt-2 space-y-3"
          @submit.prevent="onDelete"
        >
          <p class="text-sm text-stone-600">
            Deleting this account removes their login. Recipes they created stay on the site.
          </p>
          <label class="block space-y-2 text-sm font-medium text-stone-700" for="confirm-staff-username">
            Type <span class="font-semibold text-stone-900">{{ found.username }}</span> to delete
            <input id="confirm-staff-username" v-model="confirmName" autocomplete="off" :class="inputClass" />
          </label>
          <button
            type="submit"
            :disabled="!nameMatches || isSaving"
            class="px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-md hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {{ isSaving ? "Working…" : "Delete account" }}
          </button>
        </form>
        <p v-else class="text-sm text-stone-600">The owner account cannot be changed from here.</p>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-2">
      <section class="p-6 space-y-3 bg-white border rounded-lg border-stone-200">
        <h2 class="text-lg font-semibold text-stone-900">Senior admins</h2>
        <p v-if="!seniorAdmins.length" class="text-sm text-stone-500">None yet.</p>
        <ul v-else class="space-y-2">
          <li v-for="person in seniorAdmins" :key="text(person, 'username', 'Username')" class="text-sm text-stone-700">
            {{ text(person, "username", "Username") }}
            <span class="text-stone-500">· {{ text(person, "email", "Email") }}</span>
          </li>
        </ul>
      </section>
      <section class="p-6 space-y-3 bg-white border rounded-lg border-stone-200">
        <h2 class="text-lg font-semibold text-stone-900">Admins</h2>
        <p v-if="!admins.length" class="text-sm text-stone-500">None yet.</p>
        <ul v-else class="space-y-2">
          <li v-for="person in admins" :key="text(person, 'username', 'Username')" class="text-sm text-stone-700">
            {{ text(person, "username", "Username") }}
            <span class="text-stone-500">· {{ text(person, "email", "Email") }}</span>
          </li>
        </ul>
      </section>
    </div>

    <p v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">
      {{ errorMessage }}
    </p>
    <p v-if="notice" class="p-3 text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-md" role="status">
      {{ notice }}
    </p>
  </div>
</template>
