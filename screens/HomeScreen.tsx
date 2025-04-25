'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';
import TagChip from '../components/TagChip';
import { popularTags, Recipe } from '@/constants/types';
import axios from 'axios';

const HomeScreen: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    if (allRecipes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % allRecipes.length);
    }, 4000); // change image every 4 seconds

    return () => clearInterval(interval);
  }, [allRecipes]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://recipev.vercel.app/api/getAllRecipes');
        setAllRecipes(res.data.allRecipes);
        setFilteredRecipes(res.data.allRecipes);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    const lowerSearch = searchQuery.toLowerCase();
    const filtered = allRecipes.filter((recipe) => {
      const matchesTag = selectedTag ? recipe.tags.includes(selectedTag) : true;
      const matchesSearch = recipe.title.toLowerCase().includes(lowerSearch);
      return matchesTag && matchesSearch;
    });
    setFilteredRecipes(filtered);
  }, [selectedTag, searchQuery, allRecipes]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{
            uri:
              allRecipes.length > 0
                ? allRecipes[currentHeroIndex]?.image_url || 'https://via.placeholder.com/800x400'
                : 'https://via.placeholder.com/800x400',
          }}
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
                  value={searchQuery}
                  onChangeText={setSearchQuery}
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
                <TouchableOpacity
                  key={tag}
                  onPress={() => setSelectedTag(selectedTag === tag ? '' : tag)}>
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

          {loading ? (
            <View>
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
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
    padding: SPACING.md,
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
    // marginBottom: SPACING.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default HomeScreen;
