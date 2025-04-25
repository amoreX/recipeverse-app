import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Ingredient = {
  description: string;
  quantity?: number;
  unit?: string;
  order_index: number;
};

type Instruction = {
  step_number: number;
  description: string;
};

type Recipe = {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  cook_time: number;
  servings: number;
  difficulty: string;
  cuisine?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tags: string[];
  user_id: string;
};

type RecipeStore = {
  recipes: Recipe[];
  draftRecipes: Recipe[];
  publishedRecipes: Recipe[];
  selectedRecipe: Recipe | null;
  setRecipes: (recipes: Recipe[]) => void;
  selectRecipe: (recipe: Recipe | null) => void;
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (id: string) => void;
};

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set) => ({
      recipes: [],
      draftRecipes: [],
      publishedRecipes: [],
      selectedRecipe: null,

      setRecipes: (recipes) => {
        const drafts = recipes.filter((recipe) => !recipe.is_published);
        const published = recipes.filter((recipe) => recipe.is_published);
        set({
          recipes,
          draftRecipes: drafts,
          publishedRecipes: published,
        });
      },

      selectRecipe: (recipe) => set({ selectedRecipe: recipe }),

      addRecipe: (recipe) =>
        set((state) => {
          const updatedRecipes = [...state.recipes, recipe];
          return {
            recipes: updatedRecipes,
            draftRecipes: recipe.is_published
              ? state.draftRecipes
              : [...state.draftRecipes, recipe],
            publishedRecipes: recipe.is_published
              ? [...state.publishedRecipes, recipe]
              : state.publishedRecipes,
          };
        }),

      removeRecipe: (id) =>
        set((state) => {
          const updatedRecipes = state.recipes.filter((r) => r.id !== id);
          return {
            recipes: updatedRecipes,
            draftRecipes: state.draftRecipes.filter((r) => r.id !== id),
            publishedRecipes: state.publishedRecipes.filter((r) => r.id !== id),
          };
        }),
    }),
    {
      name: 'recipe-storage', // LocalStorage key
      partialize: (state) => ({
        selectedRecipe: state.selectedRecipe,
      }),
    }
  )
);
