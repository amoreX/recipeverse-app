import type React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../constants/types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import TagChip from './TagChip';
import { Recipe } from '../constants/types';
import axios from 'axios';
import { userStore } from '@/stores/userStore';
import { User } from '../constants/types';
import { useRecipeStore } from '@/stores/recipeStore';

interface RecipeCardProps {
  recipe: Recipe;
}

const { width } = Dimensions.get('window');

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isAuthenticated, user } = userStore();
  const { selectRecipe, removeRecipe } = useRecipeStore();
  const [recipeUser, setRecipeUser] = useState<User | null>();
  const [isSaved, setSave] = useState(false);
  const handlePress = () => {
    selectRecipe(recipe);
    navigation.navigate('RecipeDetail', { recipeId: recipe.id });
  };

  const gettingUser = async () => {
    const res = await axios.post('https://recipev.vercel.app/api/getRecipeUser', {
      userId: recipe.user_id,
    });
    setRecipeUser(res.data.user);
  };
  useEffect(() => {
    gettingUser();
  }, [recipe]);

  const toggleSave = () => {
    if (!isAuthenticated) {
      navigation.navigate('SignIn');
      return;
    }

    const handleSave = async () => {
      await axios.post('https://recipev.vercel.app/api/addFavourite', {
        userId: user?.id,
        recipeId: recipe.id,
      });
      setSave(!isSaved);
    };
    handleSave();
  };

  const handleDelete = () => {
    // Show confirmation dialog
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Call API to delete recipe
              await axios.post('https://recipev.vercel.app/api/deleteRecipe', {
                recipeId: recipe.id,
                userId: user?.id
              });

              // Remove from local state
              removeRecipe(recipe.id);
            } catch (error) {
              console.error('Error deleting recipe:', error);
              Alert.alert('Error', 'Failed to delete recipe');
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.post('https://recipev.vercel.app/api/getFavourites', {
          userId: user.id,
        });
        const isAlreadySaved = res.data.favs?.some((r: { id: string }) => r.id === recipe.id);
        setSave(isAlreadySaved);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavourites();
  }, [user?.id, recipe.id]);

  // Check if current user is the recipe creator
  const isOwner = user?.id === recipe.user_id;

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image_url || 'https://via.placeholder.com/400x300' }}
          style={styles.image}
          resizeMode="cover"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleSave();
          }}>
          <Feather
            name={isSaved ? 'heart' : 'heart'}
            size={18}
            color={isSaved ? COLORS.primary : COLORS.white}
            style={isSaved ? styles.savedIcon : {}}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.tagsContainer}>
          {recipe.tags.slice(0, 2).map((tag, index) => (
            <TagChip key={index} tag={tag} small />
          ))}
          {recipe.tags.length > 2 && (
            <Text style={styles.extraTagsText}>+{recipe.tags.length - 2}</Text>
          )}
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.author}>
            <View style={styles.avatarContainer}>
              {recipeUser?.avatar_url ? (
                <Image source={{ uri: recipeUser.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarFallbackText}>{recipeUser?.name?.charAt(0)}</Text>
                </View>
              )}
            </View>
            <Text style={styles.authorName} numberOfLines={1}>
              {recipeUser?.name ? recipeUser.name : recipeUser?.email}
            </Text>
          </TouchableOpacity>
          <View style={styles.footerActions}>
            {isOwner && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}>
                <Feather name="trash-2" size={14} color={COLORS.error} />
              </TouchableOpacity>
            )}
            <View style={styles.cookTime}>
              <Feather name="clock" size={14} color={COLORS.textMuted} />
              <Text style={styles.cookTimeText}>{recipe.cook_time} mins</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  draftBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  draftText: {
    fontFamily: FONTS.body.medium,
    fontSize: SIZES.xs,
    color: COLORS.textDark,
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedIcon: {
    color: COLORS.primary,
  },
  content: {
    padding: SPACING.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.xs,
    gap: 4,
  },
  extraTagsText: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    alignSelf: 'center',
    marginLeft: 4,
  },
  title: {
    fontFamily: FONTS.heading.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  description: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
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
    fontSize: SIZES.xs,
    color: COLORS.primary,
  },
  authorName: {
    fontFamily: FONTS.body.medium,
    fontSize: SIZES.xs,
    color: COLORS.textDark,
    flex: 1,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
    marginRight: 4,
  },
  cookTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cookTimeText: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
});

export default RecipeCard;