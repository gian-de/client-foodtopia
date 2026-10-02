export interface UserTldr {
  username: string | null;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
  imagePath: string;
  recipes: unknown[] | null;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  measurement: string | null;
}

export interface Instruction {
  id: string;
  order: number;
  text: string;
}

export interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  imageUrls: string[];
  heartCount: number;
  tasteAverage: number | null;
  difficultyAverage: number | null;
  tasteReviewCount: number | null;
  difficultyReviewCount: number | null;
  visibilityStatus: string;
  publishedAt: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  user: UserTldr | null;
  countryId: string;
  country: Country;
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export interface PagedRecipes {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  results: Recipe[];
}
