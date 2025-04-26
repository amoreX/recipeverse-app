'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../constants/types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import Button from '../components/Button';
import RecipeCard from '../components/RecipeCard';
import Input from '../components/Input';
import TagChip from '../components/TagChip';
import { popularTags } from '../constants/types';
import { userStore } from '@/stores/userStore';
import { Recipe } from '../constants/types';
import axios from 'axios';

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated } = userStore();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filteredRecipes = savedRecipes.filter((recipe) => {
    const matchesSearch =
      searchQuery === '' ||
      recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => recipe.tags?.includes(tag));

    return matchesSearch && matchesTags;
  });

  const renderSkeletons = () => {
    return (
      <>
        {[...Array(4)].map((_, index) => (
          <View key={index} style={styles.skeletonCard} />
        ))}
      </>
    );
  };

  const loadFavorites = async () => {
    if (!isAuthenticated) {
      setSavedRecipes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('https://recipev.vercel.app/api/getFavourites', {
        userId: user?.id,
      });
      setSavedRecipes(res.data.favs || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <TouchableOpacity onPress={loadFavorites} style={styles.refreshButton}>
          <Feather name="refresh-ccw" size={20} color={COLORS.primary} />
        </TouchableOpacity>
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
          {loading ? (
            renderSkeletons()
          ) : savedRecipes.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Feather name="heart" size={32} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyStateTitle}>No Saved Recipes</Text>
              <Text style={styles.emptyStateDescription}>
                Start exploring recipes and save your favorites to see them here.
              </Text>
              <Button
                title="Explore Recipes"
                onPress={() => navigation.navigate('Main', { screen: 'Home' })}
                style={styles.emptyStateButton}
              />
            </View>
          ) : (
            <FlatList
              data={filteredRecipes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              scrollEnabled={false}
            />
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
  refreshButton: {
    padding: SPACING.sm,
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
  skeletonCard: {
    height: 180,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: SPACING.lg,
    opacity: 0.4,
  },
});

export default FavoritesScreen;
