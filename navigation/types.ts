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
