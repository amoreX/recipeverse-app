'use client';

import type React from 'react';
import { useState } from 'react';
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
import type { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import TagChip from '../components/TagChip';
import Button from '../components/Button';

type RecipeDetailRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

// Mock data for a single recipe
const recipe = {
  id: '1',
  title: 'Rustic Sourdough Bread',
  description:
    'A crusty, artisanal sourdough bread with a chewy interior and complex flavor profile. Perfect for sandwiches or alongside soups.',
  image: 'https://via.placeholder.com/800x400',
  cookTime: 90,
  servings: 8,
  tags: ['Baking', 'Bread', 'Seasonal'],
  author: {
    id: 'user1',
    name: 'Julia Chen',
    avatar: null,
  },
  ingredients: [
    '500g bread flour',
    '350g water',
    '100g active sourdough starter',
    '10g salt',
    'Rice flour for dusting',
  ],
  instructions: [
    'Mix flour, water, and starter until no dry flour remains. Let rest for 30 minutes.',
    'Add salt and fold dough to incorporate. Let rest for 30 minutes.',
    'Perform 3-4 sets of stretch and folds, 30 minutes apart.',
    'Shape dough into a tight ball and place in a floured banneton, seam side up.',
    'Refrigerate overnight (8-12 hours) for slow fermentation.',
    'Preheat oven to 500°F (260°C) with a Dutch oven inside.',
    'Turn dough out onto parchment, score the top, and transfer to the hot Dutch oven.',
    'Bake covered for 20 minutes, then uncovered for 20-25 minutes until deep golden brown.',
    'Cool completely on a wire rack before slicing.',
  ],
};

const RecipeDetailScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RecipeDetailRouteProp>();
  const { recipeId } = route.params;

  const [isSaved, setIsSaved] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const toggleIngredient = (ingredient: string) => {
    if (checkedIngredients.includes(ingredient)) {
      setCheckedIngredients(checkedIngredients.filter((item) => item !== ingredient));
    } else {
      setCheckedIngredients([...checkedIngredients, ingredient]);
    }
  };

  const handleAuthorPress = () => {
    navigation.navigate('UserProfile', { userId: recipe.author.id });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground source={{ uri: recipe.image }} style={styles.heroImage}>
          <View style={styles.heroOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.heroContent}>
              <View style={styles.tagsContainer}>
                {recipe.tags.map((tag, index) => (
                  <TagChip key={index} tag={tag} variant="light" />
                ))}
              </View>
              <Text style={styles.title}>{recipe.title}</Text>
              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Feather name="clock" size={16} color={COLORS.white} />
                  <Text style={styles.metaText}>{recipe.cookTime} mins</Text>
                </View>
                <View style={styles.metaItem}>
                  <Feather name="users" size={16} color={COLORS.white} />
                  <Text style={styles.metaText}>{recipe.servings} servings</Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <View style={styles.authorContainer}>
            <TouchableOpacity style={styles.author} onPress={handleAuthorPress}>
              <View style={styles.avatarContainer}>
                {recipe.author.avatar ? (
                  <Image source={{ uri: recipe.author.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarFallbackText}>{recipe.author.name.charAt(0)}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.authorName}>{recipe.author.name}</Text>
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
            <Text style={styles.description}>{recipe.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsList}>
              {recipe.ingredients.map((ingredient, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.ingredientItem}
                  onPress={() => toggleIngredient(ingredient)}>
                  <View
                    style={[
                      styles.checkbox,
                      checkedIngredients.includes(ingredient) && styles.checkedBox,
                    ]}>
                    {checkedIngredients.includes(ingredient) && (
                      <Feather name="check" size={14} color={COLORS.white} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.ingredientText,
                      checkedIngredients.includes(ingredient) && styles.checkedText,
                    ]}>
                    {ingredient}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.instructionsList}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </View>

          <Button title="Print Recipe" onPress={() => {}} style={styles.printButton} />
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
    justifyContent: 'flex-end',
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
