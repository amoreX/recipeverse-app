import type React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import TagChip from './TagChip';

interface Author {
  id: string;
  name: string;
  avatar: string | null;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: number;
  tags: string[];
  author: Author;
  isDraft?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
  onSave?: () => void;
  isSaved?: boolean;
}

const { width } = Dimensions.get('window');

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSave, isSaved = false }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('RecipeDetail', { recipeId: recipe.id });
  };

  const handleAuthorPress = () => {
    navigation.navigate('UserProfile', { userId: recipe.author.id });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image || 'https://via.placeholder.com/400x300' }}
          style={styles.image}
          resizeMode="cover"
        />
        {recipe.isDraft && (
          <View style={styles.draftBadge}>
            <Text style={styles.draftText}>Draft</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={(e) => {
            e.stopPropagation();
            onSave && onSave();
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
            <Text style={styles.authorName} numberOfLines={1}>
              {recipe.author.name}
            </Text>
          </TouchableOpacity>
          <View style={styles.cookTime}>
            <Feather name="clock" size={14} color={COLORS.textMuted} />
            <Text style={styles.cookTimeText}>{recipe.cookTime} mins</Text>
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
