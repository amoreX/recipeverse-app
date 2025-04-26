'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../constants/types';
import { launchImageLibrary } from 'react-native-image-picker';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import { userStore } from '@/stores/userStore';
import { useRecipeStore } from '@/stores/recipeStore';

import Button from '../components/Button';
import RecipeCard from '../components/RecipeCard';
import Input from '../components/Input';
import TagChip from '../components/TagChip';
import { ActivityIndicator } from 'react-native';

import { popularTags } from '../constants/types';
import axios from 'axios';
const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isAuthenticated, clearUser, setUser } = userStore();
  const { recipes } = useRecipeStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'recipes'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [numfav, setNumfav] = useState<number>(0);

  const [recipeView, setRecipeView] = useState<'all' | 'published' | 'drafts'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  useEffect(() => {
    const handleNumfav = async () => {
      try {
        const res = await axios.post('https://recipev.vercel.app/api/countFav', {
          userId: user?.id,
        });
        setNumfav(res.data.numfav);
      } catch (err) {
        console.log(err);
      }
    };
    handleNumfav();
  }, [user]);
  const handleSaveProfile = async () => {
    if (!user) return;
    const updatedUser = {
      ...user,
      name: name.trim() !== '' ? name : user?.name,
      bio: bio.trim() !== '' ? bio : user?.bio,
      avatar_url: user?.avatar_url,
    };

    setLoading(true); // Start loading
    try {
      await handleBackendSave(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.log('Backend profile update ERROR!');
    } finally {
      setLoading(false); // End loading
    }
  };
  const handleBackendSave = async (updatedUser: NonNullable<typeof user>) => {
    await axios.post('https://recipev.vercel.app/api/updateUser', {
      userId: updatedUser.id,
      name: updatedUser.name || '',
      bio: updatedUser.bio || '',
      avatarurl: updatedUser.avatar_url || '',
    });
  };
  const filteredRecipes = recipes.filter((recipe) => {
    if (recipeView === 'published' && !recipe.is_published) return false;
    if (recipeView === 'drafts' && recipe.is_published) return false;

    if (selectedTags.length > 0) {
      return selectedTags.some((tag) => recipe.tags.includes(tag));
    }

    return true;
  });

  const handleLogout = () => {
    clearUser();
    navigation.navigate('Main', { screen: 'Home' });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('SignIn');
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <View style={styles.content}>
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIcon}>
            <Feather name="user" size={32} color={COLORS.textMuted} />
          </View>
          <Text style={styles.emptyStateTitle}>Not logged in</Text>
          <Text style={styles.emptyStateDescription}>
            Log in to start exploring recipes and save your favorites.
          </Text>
          <Button
            title="Sign in"
            onPress={() => navigation.navigate('SignIn')}
            style={styles.emptyStateButton}
          />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        {activeTab === 'profile' ? (
          isEditing ? (
            <View style={styles.headerButtons}>
              <Button
                title="Cancel"
                variant="outline"
                size="small"
                onPress={() => setIsEditing(false)}
                style={styles.headerButton}
              />
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Button
                  title="Save"
                  size="small"
                  onPress={handleSaveProfile}
                  style={styles.headerButton}
                  disabled={loading} // Disable button while loading
                />
              )}
            </View>
          ) : (
            <Button
              title="Edit"
              size="small"
              onPress={() => setIsEditing(true)}
              icon={<Feather name="edit-2" size={16} color={COLORS.white} />}
            />
          )
        ) : (
          <Button
            title="Create"
            size="small"
            onPress={() => navigation.navigate('CreateRecipe')}
            icon={<Feather name="plus" size={16} color={COLORS.white} />}
          />
        )}
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}>
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
          onPress={() => setActiveTab('recipes')}>
          <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>
            My Recipes
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'profile' ? (
          <View style={styles.profileContent}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                {user?.avatar_url ? (
                  <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarFallbackText}>{user?.email?.charAt(0)}</Text>
                  </View>
                )}
              </View>
              {!isEditing && (
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{user?.name}</Text>
                  <Text style={styles.profileEmail}>{user?.email}</Text>
                </View>
              )}
            </View>

            {isEditing ? (
              <View style={styles.editForm}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Name</Text>
                  <Input value={name} onChangeText={setName} placeholder="Your name" />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Bio</Text>
                  <Input
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Tell us about yourself..."
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    style={styles.bioInput}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>About</Text>
                <Text style={styles.bioText}>{user?.bio || 'No bio yet.'}</Text>
              </View>
            )}

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Stats</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{recipes.length}</Text>
                  <Text style={styles.statLabel}>Recipes</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{numfav}</Text>
                  <Text style={styles.statLabel}>Favorites</Text>
                </View>
              </View>
            </View>

            <Button
              title="Sign Out"
              variant="outline"
              onPress={() => handleLogout()}
              style={styles.signOutButton}
            />
          </View>
        ) : (
          <View style={styles.recipesContent}>
            <View style={styles.filterButtons}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Button
                  title="All"
                  variant={recipeView === 'all' ? 'primary' : 'outline'}
                  size="small"
                  onPress={() => setRecipeView('all')}
                  style={styles.filterButton}
                />
                <Button
                  title="Published"
                  variant={recipeView === 'published' ? 'primary' : 'outline'}
                  size="small"
                  onPress={() => setRecipeView('published')}
                  style={styles.filterButton}
                />
                <Button
                  title="Drafts"
                  variant={recipeView === 'drafts' ? 'primary' : 'outline'}
                  size="small"
                  onPress={() => setRecipeView('drafts')}
                  style={styles.filterButton}
                />
              </ScrollView>
            </View>

            <Input
              placeholder="Search your recipes..."
              leftIcon={<Feather name="search" size={16} color={COLORS.textMuted} />}
              containerStyle={styles.recipeSearchInput}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tagsScrollView}>
              <View style={styles.tagsContainer}>
                {popularTags.map((tag) => (
                  <TouchableOpacity key={tag} onPress={() => toggleTag(tag)}>
                    <TagChip tag={tag} active={selectedTags.includes(tag)} />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {filteredRecipes.length > 0 ? (
              <FlatList
                data={filteredRecipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <RecipeCard recipe={item} />}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon}>
                  <Feather name="file-text" size={32} color={COLORS.textMuted} />
                </View>
                <Text style={styles.emptyStateTitle}>No recipes yet</Text>
                <Text style={styles.emptyStateDescription}>
                  {recipeView === 'all'
                    ? "You haven't created any recipes yet."
                    : recipeView === 'published'
                      ? "You don't have any published recipes yet."
                      : "You don't have any draft recipes yet."}
                </Text>
                <Button
                  title="Create Your First Recipe"
                  onPress={() => navigation.navigate('CreateRecipe')}
                  style={styles.emptyStateButton}
                />
              </View>
            )}
          </View>
        )}
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
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: SPACING.sm,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
  profileContent: {
    padding: SPACING.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    position: 'relative',
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
  content: {
    padding: SPACING.lg,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontFamily: FONTS.heading.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
  },
  editForm: {
    marginBottom: SPACING.lg,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontFamily: FONTS.body.medium,
    fontSize: SIZES.sm,
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  bioInput: {
    height: 100,
    paddingTop: SPACING.sm,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
    minWidth: 100,
  },
  statValue: {
    fontFamily: FONTS.heading.semiBold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
  },
  searchInput: {
    marginBottom: SPACING.md,
  },
  sectionSubtitle: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  chefItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chefAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.md,
  },
  chefAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  chefAvatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chefAvatarFallbackText: {
    fontFamily: FONTS.body.semiBold,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },
  chefInfo: {
    flex: 1,
  },
  chefName: {
    fontFamily: FONTS.body.medium,
    fontSize: SIZES.md,
    color: COLORS.textDark,
  },
  chefRecipeCount: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
  signOutButton: {
    marginBottom: SPACING.xl,
  },
  recipesContent: {
    padding: SPACING.lg,
  },
  filterButtons: {
    marginBottom: SPACING.md,
  },
  filterButton: {
    marginRight: SPACING.sm,
  },
  recipeSearchInput: {
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

export default ProfileScreen;
