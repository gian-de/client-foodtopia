<script setup lang="ts">
import { pageItems, text } from "~/utils/json";
import { serverErrorMessage } from "~/utils/apiErrorMessage";

const { authFetch } = useAuthFetch();

const inputClass =
  "w-full px-4 py-2.5 text-base border rounded-md border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60";

const recipes = ref<Record<string, unknown>[]>([]);
const countries = ref<Record<string, unknown>[]>([]);
const errorMessage = ref("");
const successMessage = ref("");
const isLoading = ref(false);
const isSaving = ref(false);
const submittingId = ref("");

const form = reactive({
  name: "",
  countryId: "",
  imageUrl: "",
  prepTimeMinutes: 15,
  cookTimeMinutes: 20,
  ingredientName: "",
  ingredientQuantity: 1,
  ingredientMeasurement: "",
  instruction: "",
});

async function load() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const [mine, countryList] = await Promise.all([
      authFetch("/api/recipes/my?page=1&pageSize=50"),
      authFetch("/api/countries"),
    ]);
    recipes.value = pageItems(mine);
    countries.value = Array.isArray(countryList)
      ? countryList.map((item) => item as Record<string, unknown>)
      : pageItems(countryList);
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
    await authFetch("/api/recipes", {
      method: "POST",
      body: {
        name: form.name.trim(),
        countryId: form.countryId,
        imageUrl: form.imageUrl.trim(),
        prepTimeMinutes: Number(form.prepTimeMinutes),
        cookTimeMinutes: Number(form.cookTimeMinutes),
        ingredients: [
          {
            name: form.ingredientName.trim(),
            quantity: Number(form.ingredientQuantity),
            measurement: form.ingredientMeasurement.trim() || null,
          },
        ],
        instructions: [{ order: 1, text: form.instruction.trim() }],
      },
    });
    successMessage.value = "Recipe created. Submit it from the Submissions tab when it is ready for review.";
    form.name = "";
    form.imageUrl = "";
    form.ingredientName = "";
    form.instruction = "";
    await load();
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Could not create the recipe.";
  } finally {
    isSaving.value = false;
  }
}

async function onSubmit(id: string) {
  submittingId.value = id;
  errorMessage.value = "";
  successMessage.value = "";
  try {
    await authFetch(`/api/recipes/${id}/submissions`, { method: "POST" });
    successMessage.value = "Submitted for review.";
    await load();
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Could not submit that recipe.";
  } finally {
    submittingId.value = "";
  }
}

onMounted(load);
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <section class="p-6 space-y-4 bg-white border rounded-lg border-stone-200">
      <h2 class="text-lg font-semibold text-stone-900">Your recipes</h2>
      <p v-if="isLoading" class="text-sm text-stone-500">Loading…</p>
      <EmptyState
        v-else-if="!recipes.length"
        title="No recipes yet"
        description="Create your first recipe on the right. After it is ready, submit it for review."
      >
        <span class="text-lg font-semibold">+</span>
      </EmptyState>
      <ul v-else class="space-y-3">
        <li
          v-for="recipe in recipes"
          :key="text(recipe, 'id', 'Id')"
          class="flex items-center justify-between gap-3"
        >
          <div>
            <p class="font-medium text-stone-900">{{ text(recipe, "name", "Name") }}</p>
            <p class="text-sm text-stone-500">{{ text(recipe, "visibilityStatus", "VisibilityStatus") }}</p>
          </div>
          <div class="flex gap-3">
            <button
              v-if="text(recipe, 'visibilityStatus', 'VisibilityStatus') !== 'public'"
              type="button"
              class="text-sm font-medium text-brand-600 hover:text-brand-700 disabled:opacity-60"
              :disabled="submittingId === text(recipe, 'id', 'Id')"
              @click="onSubmit(text(recipe, 'id', 'Id'))"
            >
              Submit
            </button>
            <NuxtLink
              :to="`/recipes/${text(recipe, 'id', 'Id')}`"
              class="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              View
            </NuxtLink>
          </div>
        </li>
      </ul>
    </section>

    <form
      class="p-6 space-y-4 bg-white border rounded-lg border-stone-200"
      @submit.prevent="onCreate"
    >
      <h2 class="text-lg font-semibold text-stone-900">Create a recipe</h2>
      <label class="block space-y-2 text-sm font-medium text-stone-700">
        Name
        <input v-model="form.name" required :class="inputClass" />
      </label>
      <label class="block space-y-2 text-sm font-medium text-stone-700">
        Country
        <select v-model="form.countryId" required :class="inputClass">
          <option value="" disabled>Choose a country</option>
          <option
            v-for="country in countries"
            :key="text(country, 'id', 'Id')"
            :value="text(country, 'id', 'Id')"
          >
            {{ text(country, "name", "Name") }}
          </option>
        </select>
      </label>
      <label class="block space-y-2 text-sm font-medium text-stone-700">
        Image URL
        <input v-model="form.imageUrl" required :class="inputClass" placeholder="https://" />
      </label>
      <div class="grid grid-cols-2 gap-3">
        <label class="block space-y-2 text-sm font-medium text-stone-700">
          Prep minutes
          <input v-model.number="form.prepTimeMinutes" type="number" min="0" max="1440" required :class="inputClass" />
        </label>
        <label class="block space-y-2 text-sm font-medium text-stone-700">
          Cook minutes
          <input v-model.number="form.cookTimeMinutes" type="number" min="0" max="1440" required :class="inputClass" />
        </label>
      </div>
      <label class="block space-y-2 text-sm font-medium text-stone-700">
        Ingredient
        <input v-model="form.ingredientName" required :class="inputClass" />
      </label>
      <div class="grid grid-cols-2 gap-3">
        <label class="block space-y-2 text-sm font-medium text-stone-700">
          Quantity
          <input v-model.number="form.ingredientQuantity" type="number" min="0" step="0.1" required :class="inputClass" />
        </label>
        <label class="block space-y-2 text-sm font-medium text-stone-700">
          Measurement
          <input v-model="form.ingredientMeasurement" :class="inputClass" placeholder="cups" />
        </label>
      </div>
      <label class="block space-y-2 text-sm font-medium text-stone-700">
        First step
        <textarea v-model="form.instruction" required rows="3" :class="inputClass" />
      </label>
      <p v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md" role="alert">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="p-3 text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-md" role="status">
        {{ successMessage }}
      </p>
      <button
        type="submit"
        :disabled="isSaving"
        class="w-full px-5 py-2.5 text-sm font-medium text-white rounded-md bg-brand-600 hover:bg-brand-700 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        {{ isSaving ? "Creating…" : "Create recipe" }}
      </button>
    </form>
  </div>
</template>
