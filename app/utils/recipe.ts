import type { Country, Recipe } from "~/types/recipe";

function pick(raw: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    if (raw[key] !== undefined && raw[key] !== null) return raw[key];
  }
  return undefined;
}

function asNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function asCountry(value: unknown): Country {
  const raw = (value ?? {}) as Record<string, unknown>;
  return {
    id: String(pick(raw, "id", "Id") ?? ""),
    name: String(pick(raw, "name", "Name") ?? ""),
    slug: String(pick(raw, "slug", "Slug") ?? ""),
    imagePath: String(pick(raw, "imagePath", "ImagePath") ?? ""),
    recipes: (pick(raw, "recipes", "Recipes") as Country["recipes"]) ?? null,
  };
}

export function countrySearchPath(countryName: string) {
  return `/recipes?q=${encodeURIComponent(countryName)}`;
}

export function formatMinutes(value: unknown) {
  const n = asNumber(value);
  return n === 1 ? "1 min" : `${n} mins`;
}

export function normalizeRecipe(rawInput: unknown): Recipe {
  const raw = (rawInput ?? {}) as Record<string, unknown>;
  const ingredients = (pick(raw, "ingredients", "Ingredients") as unknown[]) ?? [];
  const instructions = (pick(raw, "instructions", "Instructions") as unknown[]) ?? [];
  const user = pick(raw, "user", "User") as Record<string, unknown> | null | undefined;

  return {
    id: String(pick(raw, "id", "Id") ?? ""),
    name: String(pick(raw, "name", "Name") ?? ""),
    imageUrl: String(pick(raw, "imageUrl", "ImageUrl") ?? ""),
    imageUrls: (() => {
      const listed = pick(raw, "imageUrls", "ImageUrls");
      const urls = Array.isArray(listed) ? listed.map((item) => String(item)).filter(Boolean) : [];
      const cover = String(pick(raw, "imageUrl", "ImageUrl") ?? "");
      if (!urls.length && cover) urls.push(cover);
      return urls.slice(0, 5);
    })(),
    heartCount: asNumber(pick(raw, "heartCount", "HeartCount")),
    tasteAverage: (pick(raw, "tasteAverage", "TasteAverage") as number | null) ?? null,
    difficultyAverage:
      (pick(raw, "difficultyAverage", "DifficultyAverage") as number | null) ?? null,
    tasteReviewCount:
      (pick(raw, "tasteReviewCount", "TasteReviewCount") as number | null) ?? null,
    difficultyReviewCount:
      (pick(raw, "difficultyReviewCount", "DifficultyReviewCount") as number | null) ??
      null,
    visibilityStatus: String(pick(raw, "visibilityStatus", "VisibilityStatus") ?? ""),
    publishedAt: String(pick(raw, "publishedAt", "PublishedAt") ?? ""),
    prepTimeMinutes: asNumber(pick(raw, "prepTimeMinutes", "PrepTimeMinutes")),
    cookTimeMinutes: asNumber(pick(raw, "cookTimeMinutes", "CookTimeMinutes")),
    totalTimeMinutes: (() => {
      const prep = asNumber(pick(raw, "prepTimeMinutes", "PrepTimeMinutes"));
      const cook = asNumber(pick(raw, "cookTimeMinutes", "CookTimeMinutes"));
      const total = pick(raw, "totalTimeMinutes", "TotalTimeMinutes");
      return total === undefined ? prep + cook : asNumber(total);
    })(),
    user: user
      ? { username: String(pick(user, "username", "UserName", "userName") ?? "") }
      : null,
    countryId: String(pick(raw, "countryId", "CountryId") ?? ""),
    country: asCountry(pick(raw, "country", "Country")),
    ingredients: ingredients.map((item) => {
      const ingredient = (item ?? {}) as Record<string, unknown>;
      return {
        id: String(pick(ingredient, "id", "Id") ?? ""),
        name: String(pick(ingredient, "name", "Name") ?? ""),
        quantity: asNumber(pick(ingredient, "quantity", "Quantity")),
        measurement: (pick(ingredient, "measurement", "Measurement") as string | null) ?? null,
      };
    }),
    instructions: instructions.map((item) => {
      const step = (item ?? {}) as Record<string, unknown>;
      return {
        id: String(pick(step, "id", "Id") ?? ""),
        order: asNumber(pick(step, "order", "Order")),
        text: String(pick(step, "text", "Text") ?? ""),
      };
    }),
  };
}

export function normalizePagedRecipes(rawInput: unknown) {
  const raw = (rawInput ?? {}) as Record<string, unknown>;
  const results = (pick(raw, "results", "Results") as unknown[]) ?? [];
  return {
    totalCount: asNumber(pick(raw, "totalCount", "TotalCount")),
    currentPage: asNumber(pick(raw, "currentPage", "CurrentPage")),
    pageSize: asNumber(pick(raw, "pageSize", "PageSize")),
    totalPages: asNumber(pick(raw, "totalPages", "TotalPages")),
    results: results.map(normalizeRecipe),
  };
}
