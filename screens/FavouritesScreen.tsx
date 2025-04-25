'use client';

import type React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import Button from '../components/Button';
import RecipeCard from '../components/RecipeCard';
import Input from '../components/Input';
import TagChip from '../components/TagChip';

// Mock data
const popularTags = [
  'Seasonal',
  'Vegetarian',
  'Dessert',
  'Baking',
  'Healthy',
  'Quick',
  'Gluten-Free',
];

const savedRecipes = [
  {
    id: '1',
    title: 'Rustic Sourdough Bread',
    description:
      'A crusty, artisanal sourdough bread with a chewy interior and complex flavor profile.',
    image: 'https://via.placeholder.com/400x300',
    cookTime: 90,
    tags: ['Baking', 'Bread', 'Seasonal'],
    author: {
      id: 'user1',
      name: 'Julia Chen',
      avatar: null,
    },
  },
  {
    id: '2',
    title: 'Summer Berry Pavlova',
    description:
      'A light and elegant dessert featuring a crisp meringue base topped with whipped cream and fresh seasonal berries.',
    image: 'https://via.placeholder.com/400x300',
    cookTime: 120,
    tags: ['Dessert', 'Seasonal', 'Gluten-Free'],
    author: {
      id: 'user2',
      name: 'Marcus Rivera',
      avatar: null,
    },
  },
];

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>(savedRecipes.map((r) => r.id));

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const toggleSaveRecipe = (recipeId: string) => {
    if (savedRecipeIds.includes(recipeId)) {
      setSavedRecipeIds(savedRecipeIds.filter((id) => id !== recipeId));
    } else {
      setSavedRecipeIds([...savedRecipeIds, recipeId]);
    }
  };

  const filteredRecipes = savedRecipes.filter((recipe) => {
    // Only show recipes that are still in savedRecipeIds
    if (!savedRecipeIds.includes(recipe.id)) return false;

    // Filter by search query
    const matchesSearch =
      searchQuery === '' ||
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by selected tags
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => recipe.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Input
            placeholder="Search your favorites..."
            leftIcon={<Feather name="search" size={16} color={COLORS.textMuted} />}
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={styles.searchInput}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsScrollView}>
            <View style={styles.tagsContainer}>
              {popularTags.map((tag) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  active={selectedTags.includes(tag)}
                  onPress={() => toggleTag(tag)}
                />
              ))}
            </View>
          </ScrollView>

          {filteredRecipes.length > 0 ? (
            <FlatList
              data={filteredRecipes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <RecipeCard
                  recipe={item}
                  isSaved={savedRecipeIds.includes(item.id)}
                  onSave={() => toggleSaveRecipe(item.id)}
                />
              )}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Feather name="heart" size={32} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyStateTitle}>No favorites yet</Text>
              <Text style={styles.emptyStateDescription}>
                Start exploring recipes and save your favorites to see them here.
              </Text>
              <Button
                title="Explore Recipes"
                onPress={() => navigation.navigate('Main', { screen: 'Home' })}
                style={styles.emptyStateButton}
              />
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontFamily: FONTS.heading.semiBold,
    fontSize: SIZES.xl,
    color: COLORS.textDark,
  },
  content: {
    padding: SPACING.lg,
  },
  searchInput: {
    marginBottom: SPACING.md,
  },
  tagsScrollView: {
    marginBottom: SPACING.lg,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    marginTop: SPACING.lg,
  },
  emptyStateIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  emptyStateTitle: {
    fontFamily: FONTS.heading.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  emptyStateDescription: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.md,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  emptyStateButton: {
    minWidth: 200,
  },
});

export default FavoritesScreen;
