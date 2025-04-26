import type React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import type { RootStackParamList } from '../constants/types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import TagChip from '../components/TagChip';
import Button from '../components/Button';
import { Recipe, Ingredient, User } from '../constants/types';
import axios from 'axios';
import { userStore } from '@/stores/userStore';
import { useRecipeStore } from '@/stores/recipeStore';
type RecipeDetailRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

// Mock data for a single recipe

const RecipeDetailScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RecipeDetailRouteProp>();
  const { recipeId } = route.params;
  const { isAuthenticated, user } = userStore();
  const { selectedRecipe } = useRecipeStore();
  const [isSaved, setIsSaved] = useState(false);
  const [recipeUser, setRecipeUser] = useState<User | null>();
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const recipe = selectedRecipe;
  const toggleSave = () => {
    if (!isAuthenticated) {
      navigation.navigate('SignIn');
      return;
    }

    const handleSave = async () => {
      await axios.post('https://recipev.vercel.app/api/addFavourite', {
        userId: user?.id,
        recipeId: recipe?.id,
      });
      setIsSaved(!isSaved);
    };
    handleSave();
  };
  const toggleIngredient = (ingredient: string) => {
    if (checkedIngredients.includes(ingredient)) {
      setCheckedIngredients(checkedIngredients.filter((item) => item !== ingredient));
    } else {
      setCheckedIngredients([...checkedIngredients, ingredient]);
    }
  };
  useEffect(() => {
    const fetchFavourites = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.post('https://recipev.vercel.app/api/getFavourites', {
          userId: user.id,
        });
        const isAlreadySaved = res.data.favs?.some((r: { id: string }) => r.id === recipe?.id);
        setIsSaved(isAlreadySaved);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavourites();
  }, [user?.id, recipe?.id]);

  const gettingUser = async () => {
    if (!recipe) return;
    const res = await axios.post('https://recipev.vercel.app/api/getRecipeUser', {
      userId: recipe.user_id,
    });
    setRecipeUser(res.data.user);
  };
  useEffect(() => {
    gettingUser();
  }, [recipe]);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground source={{ uri: recipe?.image_url }} style={styles.heroImage}>
          <View style={styles.heroOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.heroContent}>
              <View style={styles.tagsContainer}>
                {recipe?.tags.map((tag, index) => (
                  <TagChip key={index} tag={tag} variant="light" />
                ))}
              </View>
              <Text style={styles.title}>{recipe?.title}</Text>
              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Feather name="clock" size={16} color={COLORS.white} />
                  <Text style={styles.metaText}>{recipe?.cook_time} mins</Text>
                </View>
                <View style={styles.metaItem}>
                  <Feather name="users" size={16} color={COLORS.white} />
                  <Text style={styles.metaText}>{recipe?.servings} servings</Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <View style={styles.authorContainer}>
            <TouchableOpacity style={styles.author}>
              <View style={styles.avatarContainer}>
                {recipeUser?.avatar_url ? (
                  <Image source={{ uri: recipeUser.avatar_url }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarFallbackText}>{recipeUser?.email.charAt(0)}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.authorName}>{recipeUser?.name}</Text>
            </TouchableOpacity>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, isSaved && styles.savedButton]}
                onPress={toggleSave}>
                <Feather name="heart" size={20} color={isSaved ? COLORS.white : COLORS.textDark} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="share-2" size={20} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{recipe?.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsList}>
              {recipe?.ingredients.map((ingredient, index) => {
                const description = ingredient.description;
                const isChecked = checkedIngredients.includes(description);
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.ingredientItem}
                    onPress={() => toggleIngredient(description)}>
                    <View style={[styles.checkbox, isChecked && styles.checkedBox]}>
                      {isChecked && <Feather name="check" size={14} color={COLORS.white} />}
                    </View>
                    <Text style={[styles.ingredientText, isChecked && styles.checkedText]}>
                      {description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.instructionsList}>
              {recipe?.instructions.map((i, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{i.description}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroImage: {
    height: 300,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  backButton: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    gap: 8,
  },
  title: {
    fontFamily: FONTS.heading.bold,
    fontSize: SIZES.xxl,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.sm,
    color: COLORS.white,
    marginLeft: 6,
  },
  content: {
    padding: SPACING.lg,
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFallbackText: {
    fontFamily: FONTS.body.semiBold,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },
  authorName: {
    fontFamily: FONTS.body.medium,
    fontSize: SIZES.md,
    color: COLORS.textDark,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  savedButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.heading.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.textDark,
    marginBottom: SPACING.md,
  },
  description: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.md,
    color: COLORS.textMuted,
    lineHeight: 24,
  },
  ingredientsList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ingredientText: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.md,
    color: COLORS.textDark,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  instructionsList: {
    gap: SPACING.lg,
  },
  instructionItem: {
    flexDirection: 'row',
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
  },
  instructionNumberText: {
    fontFamily: FONTS.body.medium,
    fontSize: SIZES.md,
    color: COLORS.white,
  },
  instructionText: {
    flex: 1,
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.md,
    color: COLORS.textDark,
    lineHeight: 24,
  },
  printButton: {
    marginTop: SPACING.md,
  },
});

export default RecipeDetailScreen;
