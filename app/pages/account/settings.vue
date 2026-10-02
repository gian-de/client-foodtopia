<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const auth = useAuthStore();
const { authFetch } = useAuthFetch();

const inputClass =
  "w-full px-4 py-2.5 text-base border rounded-md border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

const username = ref(auth.user?.username ?? "");
const email = ref(auth.user?.email ?? "");
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const usernameError = ref("");
const usernameNotice = ref("");
const emailError = ref("");
const emailNotice = ref("");
const passwordError = ref("");
const passwordNotice = ref("");
const deleteError = ref("");
const savingUsername = ref(false);
const savingEmail = ref(false);
const savingPassword = ref(false);
const confirmOpen = ref(false);
const confirmName = ref("");
const isDeleting = ref(false);

const isGuest = computed(() => auth.user?.role === "Guest");
const currentUsername = computed(() => auth.user?.username ?? "");
const nameMatches = computed(
  () => confirmName.value.trim() === currentUsername.value && currentUsername.value.length > 0
);

function passwordProblem(value: string) {
  if (!value.trim()) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter.";
  if (!/\d/.test(value)) return "Password must contain at least one number.";
  if (!/[^a-zA-Z0-9]/.test(value))
    return "Password must contain at least one special character (!@#$%^&*).";
  return "";
}

async function onUsername() {
  savingUsername.value = true;
  usernameError.value = "";
  usernameNotice.value = "";
  const next = username.value.trim();
  if (next.length < 3) {
    usernameError.value = "Username must be at least 3 characters.";
    savingUsername.value = false;
    return;
  }
  try {
    const data = await authFetch<{ userName?: string }>("/api/account/username", {
      method: "PUT",
      body: { username: next },
    });
    const saved = data.userName || next;
    username.value = saved;
    auth.updateUser({ username: saved });
    usernameNotice.value = "Username updated.";
  } catch (err) {
    usernameError.value = err instanceof Error ? err.message : "Could not update the username.";
  } finally {
    savingUsername.value = false;
  }
}

async function onEmail() {
  savingEmail.value = true;
  emailError.value = "";
  emailNotice.value = "";
  const next = email.value.trim();
  if (!next.includes("@")) {
    emailError.value = "Enter a valid email address.";
    savingEmail.value = false;
    return;
  }
  try {
    const data = await authFetch<{ email?: string; message?: string }>("/api/account/email", {
      method: "PUT",
      body: { email: next },
    });
    const saved = data.email || next;
    email.value = saved;
    auth.updateUser({ email: saved });
    emailNotice.value = data.message || "Email updated. Confirm it from your inbox before your next sign-in.";
  } catch (err) {
    emailError.value = err instanceof Error ? err.message : "Could not update the email.";
  } finally {
    savingEmail.value = false;
  }
}

async function onPassword() {
  savingPassword.value = true;
  passwordError.value = "";
  passwordNotice.value = "";
  const problem = passwordProblem(passwordForm.newPassword);
  if (!passwordForm.currentPassword.trim()) {
    passwordError.value = "Current password is required.";
  } else if (problem) {
    passwordError.value = problem;
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = "Passwords do not match.";
  }
  if (passwordError.value) {
    savingPassword.value = false;
    return;
  }
  try {
    await authFetch("/api/account/password", {
      method: "PUT",
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
    });
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
    passwordNotice.value = "Password updated.";
  } catch (err) {
    passwordError.value = err instanceof Error ? err.message : "Could not update the password.";
  } finally {
    savingPassword.value = false;
  }
}

async function onDeleteAccount() {
  if (!nameMatches.value) return;
  isDeleting.value = true;
  deleteError.value = "";
  try {
    await authFetch("/api/account/delete-account", { method: "DELETE" });
    auth.logout();
  } catch (err) {
    deleteError.value = err instanceof Error ? err.message : "Could not delete the account.";
    isDeleting.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <p v-if="isGuest" class="text-sm text-stone-600">
      Guest accounts cannot change a username, email, or password.
    </p>

    <form
      v-if="!isGuest"
      class="p-6 space-y-4 bg-white border rounded-lg border-stone-200"
      @submit.prevent="onUsername"
    >
      <h2 class="text-lg font-semibold text-stone-900">Username</h2>
      <label class="block space-y-2 text-sm font-medium text-stone-700" for="settings-username">
        New username
        <input id="settings-username" v-model="username" autocomplete="username" required :class="inputClass" />
      </label>
      <p v-if="usernameError" class="text-sm text-red-700" role="alert">{{ usernameError }}</p>
      <p v-if="usernameNotice" class="text-sm text-stone-600" role="status">{{ usernameNotice }}</p>
      <button
        type="submit"
        :disabled="savingUsername"
        class="px-4 py-2 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {{ savingUsername ? "Saving…" : "Save username" }}
      </button>
    </form>

    <form
      v-if="!isGuest"
      class="p-6 space-y-4 bg-white border rounded-lg border-stone-200"
      @submit.prevent="onEmail"
    >
      <h2 class="text-lg font-semibold text-stone-900">Email</h2>
      <p class="text-sm text-stone-600">
        A confirmation link is sent to the new address. Sign-in uses that address only after you confirm it.
      </p>
      <label class="block space-y-2 text-sm font-medium text-stone-700" for="settings-email">
        New email
        <input id="settings-email" v-model="email" type="email" autocomplete="email" required :class="inputClass" />
      </label>
      <p v-if="emailError" class="text-sm text-red-700" role="alert">{{ emailError }}</p>
      <p v-if="emailNotice" class="text-sm text-stone-600" role="status">{{ emailNotice }}</p>
      <button
        type="submit"
        :disabled="savingEmail"
        class="px-4 py-2 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {{ savingEmail ? "Saving…" : "Save email" }}
      </button>
    </form>

    <form
      v-if="!isGuest"
      class="p-6 space-y-4 bg-white border rounded-lg border-stone-200"
      @submit.prevent="onPassword"
    >
      <h2 class="text-lg font-semibold text-stone-900">Password</h2>
      <label class="block space-y-2 text-sm font-medium text-stone-700" for="current-password">
        Current password
        <input id="current-password" v-model="passwordForm.currentPassword" type="password" autocomplete="current-password" required :class="inputClass" />
      </label>
      <label class="block space-y-2 text-sm font-medium text-stone-700" for="new-password">
        New password
        <input id="new-password" v-model="passwordForm.newPassword" type="password" autocomplete="new-password" required :class="inputClass" />
      </label>
      <label class="block space-y-2 text-sm font-medium text-stone-700" for="confirm-password">
        Confirm new password
        <input id="confirm-password" v-model="passwordForm.confirmPassword" type="password" autocomplete="new-password" required :class="inputClass" />
      </label>
      <p v-if="passwordError" class="text-sm text-red-700" role="alert">{{ passwordError }}</p>
      <p v-if="passwordNotice" class="text-sm text-stone-600" role="status">{{ passwordNotice }}</p>
      <button
        type="submit"
        :disabled="savingPassword"
        class="px-4 py-2 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {{ savingPassword ? "Saving…" : "Save password" }}
      </button>
    </form>

    <section class="p-6 space-y-4 bg-white border rounded-lg border-red-200">
      <h2 class="text-lg font-semibold text-stone-900">Delete account</h2>
      <p class="text-sm text-stone-600">
        This removes your login. It cannot be undone from this page.
      </p>
      <button
        v-if="!confirmOpen"
        type="button"
        class="px-4 py-2 text-sm font-medium text-red-700 border border-red-200 rounded-md hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        @click="confirmOpen = true"
      >
        Delete account
      </button>
      <form v-else class="max-w-md space-y-3" @submit.prevent="onDeleteAccount">
        <label class="block space-y-2 text-sm font-medium text-stone-700" for="confirm-username">
          Type <span class="font-semibold text-stone-900">{{ currentUsername }}</span> to confirm
          <input id="confirm-username" v-model="confirmName" autocomplete="off" :class="inputClass" />
        </label>
        <p v-if="deleteError" class="text-sm text-red-700" role="alert">{{ deleteError }}</p>
        <div class="flex gap-2">
          <button
            type="submit"
            :disabled="!nameMatches || isDeleting"
            class="px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-md hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            {{ isDeleting ? "Deleting…" : "Delete my account" }}
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            @click="confirmOpen = false; confirmName = ''"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
