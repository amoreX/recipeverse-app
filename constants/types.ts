import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  SignIn: undefined;
  RecipeDetail: { recipeId: string };
  UserProfile: { userId: string };
  CreateRecipe: undefined; // ✅ Add this line
};

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Create: undefined;
  Profile: undefined;
};

export const popularTags = [
  'Seasonal',
  'Vegetarian',
  'Dessert',
  'Baking',
  'Healthy',
  'Quick',
  'Gluten-Free',
];

export type Instruction = {
  step_number: number;
  description: string;
};

export type User = {
  id: String;
  email: String;
  name?: string;
  avatar_url?: string;
  bio?: string;
};

export type Ingredient = {
  description: string;
  quantity?: number;
  unit?: string;
  order_index: number;
};

export type Recipe = {
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

export interface RecipeTypes {
  all: Recipe[];
  published: Recipe[];
  drafts: Recipe[];
}

export interface RecipesTabContentProps {
  recipes: RecipeTypes;
  view: string;
  setView: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: (value: string[] | ((prev: string[]) => string[])) => void;
}

export interface ProfileTabContentProps {
  user: User | null;
  isEditing: Boolean;
  name: string;
  bio: string;
  setName: (value: string) => void;
  setBio: (value: string) => void;
  setAvatar: (value: string) => void;
}

export interface ProfileTabsProps {
  user: User | null;
  recipes: RecipeTypes;
  activeTab: string;
  setActiveTab: (value: string) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: (value: string[] | ((prev: string[]) => string[])) => void;
  view: string;
  setView: (value: string) => void;
}

export interface BasicInformationProps {
  desc: string;
  setDesc: (value: string) => void;
  recipetitle: string;
  setRecipetitle: (value: string) => void;
  cookTime: number;
  setCookTime: (value: number) => void;
  servings: number;
  setServings: (value: number) => void;
}
