'use client';

import type React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import RecipeCard from '../components/RecipeCard';
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

const featuredRecipes = [
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
  {
    id: '3',
    title: 'Herb-Roasted Vegetable Salad',
    description:
      'A hearty and nutritious salad featuring roasted seasonal vegetables, fresh herbs, and a tangy vinaigrette.',
    image: 'https://via.placeholder.com/400x300',
    cookTime: 45,
    tags: ['Salad', 'Vegetarian', 'Healthy'],
    author: {
      id: 'user3',
      name: 'Sophia Kim',
      avatar: null,
    },
  },
];

const HomeScreen: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState('Seasonal');
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);

  const toggleSaveRecipe = (recipeId: string) => {
    if (savedRecipes.includes(recipeId)) {
      setSavedRecipes(savedRecipes.filter((id) => id !== recipeId));
    } else {
      setSavedRecipes([...savedRecipes, recipeId]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: 'https://via.placeholder.com/800x400' }}
          style={styles.heroImage}>
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Discover & Share Delicious Recipes</Text>
              <Text style={styles.heroSubtitle}>
                Join our community of food lovers to find inspiration and share your culinary
                creations.
              </Text>
              <View style={styles.searchContainer}>
                <Feather
                  name="search"
                  size={18}
                  color={COLORS.textMuted}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for recipes..."
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Tags</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsScrollView}>
            <View style={styles.tagsContainer}>
              {popularTags.map((tag) => (
                <TouchableOpacity key={tag} onPress={() => setSelectedTag(tag)}>
                  <TagChip tag={tag} active={selectedTag === tag} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Recipes</Text>
          </View>
          <FlatList
            data={featuredRecipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RecipeCard
                recipe={item}
                isSaved={savedRecipes.includes(item.id)}
                onSave={() => toggleSaveRecipe(item.id)}
              />
            )}
            scrollEnabled={false}
          />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  logo: {
    fontFamily: FONTS.heading.semiBold,
    fontSize: SIZES.xl,
    color: COLORS.textDark,
  },
  heroImage: {
    height: 300,
    width: '100%',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: FONTS.heading.bold,
    fontSize: SIZES.xxl,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.md,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 24,
    paddingHorizontal: SPACING.md,
    width: '100%',
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.md,
    color: COLORS.textDark,
    paddingVertical: SPACING.md,
  },
  section: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontFamily: FONTS.heading.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.textDark,
  },
  tagsScrollView: {
    marginBottom: SPACING.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default HomeScreen;
