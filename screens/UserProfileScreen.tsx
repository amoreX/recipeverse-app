'use client';

import type React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import Button from '../components/Button';
import RecipeCard from '../components/RecipeCard';

type UserProfileRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;

// Mock user data
const users = [
  {
    id: 'user1',
    name: 'Julia Chen',
    avatar: null,
    bio: 'Food enthusiast and home baker. I love creating simple, delicious recipes that anyone can make at home.',
  },
  {
    id: 'user2',
    name: 'Marcus Rivera',
    avatar: null,
    bio: 'Professional chef with a passion for Mediterranean cuisine. I share restaurant-quality recipes adapted for home cooks.',
  },
  {
    id: 'user3',
    name: 'Sophia Kim',
    avatar: null,
    bio: 'Culinary student exploring fusion cuisine. I love experimenting with flavors from around the world.',
  },
];

// Mock recipe data
const userRecipes = [
  {
    id: '1',
    title: 'Rustic Sourdough Bread',
    description:
      'A crusty, artisanal sourdough bread with a chewy interior and complex flavor profile.',
    image: 'https://via.placeholder.com/400x300',
    cookTime: 90,
    tags: ['Baking', 'Bread', 'Seasonal'],
    author: {
      id: 'user2',
      name: 'Marcus Rivera',
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

const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<UserProfileRouteProp>();
  const { userId } = route.params;

  const [activeTab, setActiveTab] = useState<'recipes' | 'favorites'>('recipes');
  const [isFollowing, setIsFollowing] = useState(false);

  // Find the user from our mock data
  const user = users.find((u) => u.id === userId) || {
    id: userId,
    name: 'Unknown User',
    avatar: null,
    bio: "This user doesn't exist or has been removed.",
  };

  // In a real app, these would be fetched based on the user
  const recipes = userRecipes.filter((recipe) => recipe.author.id === userId);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarFallbackText}>{user.name.charAt(0)}</Text>
                </View>
              )}
            </View>
            <Text style={styles.profileName}>{user.name}</Text>
            <Button
              title={isFollowing ? 'Following' : 'Follow'}
              variant={isFollowing ? 'outline' : 'primary'}
              onPress={toggleFollow}
              style={styles.followButton}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>About</Text>
            <Text style={styles.bioText}>{user.bio || "This user hasn't added a bio yet."}</Text>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
              onPress={() => setActiveTab('recipes')}>
              <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>
                Recipes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
              onPress={() => setActiveTab('favorites')}>
              <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
                Favorites
              </Text>
            </TouchableOpacity>
          </View>

          {recipes.length > 0 ? (
            <FlatList
              data={recipes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {activeTab === 'recipes'
                  ? "This user hasn't published any recipes yet."
                  : "This user hasn't saved any favorites yet."}
              </Text>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.md,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  avatarFallbackText: {
    fontFamily: FONTS.heading.bold,
    fontSize: SIZES.xxxl,
    color: COLORS.primary,
  },
  profileName: {
    fontFamily: FONTS.heading.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  followButton: {
    minWidth: 120,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontFamily: FONTS.heading.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.textDark,
    marginBottom: SPACING.md,
  },
  bioText: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.md,
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  tab: {
    paddingVertical: SPACING.md,
    marginRight: SPACING.xl,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.body.medium,
    fontSize: SIZES.md,
    color: COLORS.textMuted,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  emptyState: {
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  emptyStateText: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.md,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});

export default UserProfileScreen;
