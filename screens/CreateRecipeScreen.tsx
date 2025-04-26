'use client';

import type React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, Ingredient, Instruction } from '../constants/types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import * as ImagePicker from 'expo-image-picker';
import Button from '../components/Button';

import axios from 'axios';
import Input from '../components/Input';
import TagChip from '../components/TagChip';
import { popularTags } from '../constants/types';
import { userStore } from '@/stores/userStore';

const CreateRecipeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isAuthenticated } = userStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { description: '500g all-purpose flour', order_index: 0 },
    { description: '10g salt', order_index: 1 }
  ]);
  const [instructions, setInstructions] = useState<Instruction[]>([
    { step_number: 1, description: 'Preheat oven to 350°F (175°C).' },
    { step_number: 2, description: 'Mix all ingredients in a large bowl.' }
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Seasonal']);
  const [newIngredient, setNewIngredient] = useState('');
  const [newInstruction, setNewInstruction] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [uri, setUri] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageStatus, setImageStatus] = useState(''); // 'uploading', 'success', 'error'

  const handleImageUpload = async () => {
    try {
      setImageStatus('uploading');

      await ImagePicker.requestMediaLibraryPermissionsAsync();
      const result = await ImagePicker.launchImageLibraryAsync({
      });

      if (result?.assets) {
        setUri(result.assets[0].uri); // Local URI for temporary display

        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName,
          type: result.assets[0].mimeType,
        } as any);

        const res = await fetch('https://recipev.vercel.app/api/picUpload', {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        console.log(data);

        // Assuming data.url contains the image URL from the server
        if (data) {
          setImageUrl(data);
          setImageStatus('success');
        } else {
          setImageStatus('error');
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageStatus('error');
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Update ingredient with proper typing
  const updateIngredient = (text: string, index: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], description: text };
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);

    // Update order_index for remaining ingredients
    setIngredients(newIngredients.map((ingredient, idx) => ({
      ...ingredient,
      order_index: idx
    })));
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {

      const ingredient: Ingredient = {
        description: newIngredient.trim(),
        order_index: ingredients.length
      };

      // Simple regex to try to extract quantity and unit
      // This is a basic example - you might want to enhance this
      const match = newIngredient.match(/^([\d.]+)\s*([a-zA-Z]+)?\s+(.+)$/);
      if (match) {
        ingredient.quantity = parseFloat(match[1]);
        ingredient.unit = match[2] || undefined;
        ingredient.description = match[3];
      }

      setIngredients([...ingredients, ingredient]);
      setNewIngredient('');
    }
  };
  const updateInstruction = (text: string, index: number) => {
    const newInstructions = [...instructions];
    newInstructions[index] = {
      ...newInstructions[index],
      description: text
    };
    setInstructions(newInstructions);
  };

  const removeInstruction = (index: number) => {
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);

    // Update step_number for remaining instructions
    setInstructions(newInstructions.map((instruction, idx) => ({
      ...instruction,
      step_number: idx + 1
    })));
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      const newStep: Instruction = {
        step_number: instructions.length + 1,
        description: newInstruction.trim()
      };

      setInstructions([...instructions, newStep]);
      setNewInstruction('');
    }
  };

  const validateRecipe = () => {
    if (!title.trim()) {
      Alert.alert("Missing Information", "Please add a recipe title");
      return false;
    }
    if (!description.trim()) {
      Alert.alert("Missing Information", "Please add a recipe description");
      return false;
    }
    if (!cookTime || isNaN(Number(cookTime))) {
      Alert.alert("Missing Information", "Please add a valid cook time");
      return false;
    }
    if (!servings || isNaN(Number(servings))) {
      Alert.alert("Missing Information", "Please add a valid number of servings");
      return false;
    }
    if (ingredients.length === 0) {
      Alert.alert("Missing Information", "Please add at least one ingredient");
      return false;
    }
    if (instructions.length === 0) {
      Alert.alert("Missing Information", "Please add at least one instruction step");
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateRecipe()) return;
    if (!isAuthenticated) {
      Alert.alert("Authentication Error", "You must be logged in to save a recipe.");
      return;
    }

    const payload = {
      userId: user?.id,
      title,
      description,
      image_url: imageUrl || uri,
      cook_time: parseInt(cookTime, 10) || 0,
      servings: parseInt(servings, 10) || 0,
      difficulty,
      cuisine,
      is_published: false,
      ingredients: ingredients.map((ing, index) => ({
        ...ing,
        order_index: index,
      })),
      instructions: instructions.map((step, index) => ({
        ...step,
        step_number: index + 1,
      })),
      tags: selectedTags,
    };
    console.log(payload);

    const res = await axios.post("https://recipev.vercel.app/api/addRecipe", payload);
    console.log(res);

    Alert.alert("Draft Saved", "Your recipe has been saved as a draft.", [
      {
        text: "OK",
        onPress: () => navigation.navigate('Main', { screen: 'Home' }), // Navigate to home/main screen
      },
    ]);
    // navigation.navigate('Main', { screen: 'Profile' });
  };

  const handlePublish = async () => {
    if (!validateRecipe()) return;
    if (!isAuthenticated) {
      Alert.alert("Authentication Error", "You must be logged in to save a recipe.");
      return;
    }
    // Publish recipe
    const payload = {
      userId: user?.id,
      title,
      description,
      image_url: imageUrl || uri,
      cook_time: parseInt(cookTime, 10) || 0,
      servings: parseInt(servings, 10) || 0,
      difficulty,
      cuisine,
      is_published: true,
      ingredients: ingredients.map((ing, index) => ({
        ...ing,
        order_index: index,
      })),
      instructions: instructions.map((step, index) => ({
        ...step,
        step_number: index + 1,
      })),
      tags: selectedTags,
    };
    // console.log(payload);
    const res = await axios.post("https://recipev.vercel.app/api/addRecipe", payload);
    console.log(res);
    Alert.alert("Draft Saved", "Your recipe has been saved as a draft.", [
      {
        text: "OK",
        onPress: () => navigation.navigate('Main', { screen: 'Home' }), // Navigate to home/main screen
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Recipe</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.card}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Recipe Title</Text>
                <Input
                  placeholder="e.g., Homemade Sourdough Bread"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <Input
                  placeholder="Describe your recipe in a few sentences..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={styles.textArea}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: SPACING.sm }]}>
                  <Text style={styles.label}>Cook Time (mins)</Text>
                  <Input
                    placeholder="45"
                    value={cookTime}
                    onChangeText={setCookTime}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Servings</Text>
                  <Input
                    placeholder="4"
                    value={servings}
                    onChangeText={setServings}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.card}>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.listItem}>
                  <TextInput
                    style={styles.listItemInput}
                    value={ingredient.description}
                    onChangeText={(text) => updateIngredient(text, index)}
                    placeholder="Add ingredient..."
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeIngredient(index)}>
                    <Feather name="trash-2" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.addItemContainer}>
                <TextInput
                  style={styles.addItemInput}
                  value={newIngredient}
                  onChangeText={setNewIngredient}
                  placeholder="Add new ingredient (e.g., 2 cups flour)"
                  onSubmitEditing={addIngredient}
                />
                <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
                  <Feather name="plus" size={18} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>
                Tip: Enter ingredients like "2 cups flour" to automatically detect quantity and unit
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.card}>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{instruction.step_number}</Text>
                  </View>
                  <View style={styles.instructionContent}>
                    <TextInput
                      style={styles.instructionInput}
                      value={instruction.description}
                      onChangeText={(text) => updateInstruction(text, index)}
                      placeholder="Add instruction step..."
                      multiline
                    />
                    <TouchableOpacity
                      style={styles.removeInstructionButton}
                      onPress={() => removeInstruction(index)}>
                      <Text style={styles.removeText}>Remove</Text>
                      <Feather name="trash-2" size={14} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <View style={styles.addInstructionContainer}>
                <TextInput
                  style={styles.addInstructionInput}
                  value={newInstruction}
                  onChangeText={setNewInstruction}
                  placeholder="Add new instruction step..."
                  multiline
                />
                <Button
                  title="Add Step"
                  variant="outline"
                  size="small"
                  onPress={addInstruction}
                  icon={<Feather name="plus" size={16} color={COLORS.textDark} />}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipe Image</Text>
            <View style={styles.card}>
              {imageStatus === 'uploading' && (
                <View style={styles.imageUploadContainer}>
                  <Text style={styles.imageUploadTitle}>Uploading image...</Text>
                </View>
              )}

              {imageStatus === 'error' && (
                <TouchableOpacity
                  style={styles.imageUploadContainer}
                  onPress={() => handleImageUpload()}>
                  <View style={styles.imageUploadContent}>
                    <Feather name="alert-circle" size={32} color={COLORS.error || 'red'} />
                    <Text style={styles.imageUploadTitle}>Error uploading image</Text>
                    <Text style={styles.imageUploadSubtitle}>Tap to try again</Text>
                  </View>
                </TouchableOpacity>
              )}

              {imageStatus === 'success' ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={[styles.imageUploadContainer]}
                  resizeMode="cover"
                />
              ) : (
                uri !== '' && imageStatus !== 'uploading' && imageStatus !== 'error' ? (
                  <Image
                    source={{ uri }}
                    style={[styles.imageUploadContainer]}
                    resizeMode="cover"
                  />
                ) : (
                  imageStatus !== 'uploading' && imageStatus !== 'error' && (
                    <TouchableOpacity
                      style={styles.imageUploadContainer}
                      onPress={() => handleImageUpload()}>
                      <View style={styles.imageUploadContent}>
                        <Feather name="upload" size={32} color={COLORS.textMuted} />
                        <Text style={styles.imageUploadTitle}>Upload Recipe Image</Text>
                        <Text style={styles.imageUploadSubtitle}>Tap to browse your photos</Text>
                      </View>
                    </TouchableOpacity>
                  )
                )
              )}
              <Text style={styles.imageUploadHint}>
                Recommended size: 1200 x 800 pixels (3:2 ratio)
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.card}>
              <View style={styles.tagsContainer}>
                {popularTags.map((tag) => (
                  <TouchableOpacity key={tag} onPress={() => toggleTag(tag)}>
                    <TagChip tag={tag} active={selectedTags.includes(tag)} />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.addTagContainer}>
                <Input
                  placeholder="Add custom tag..."
                  containerStyle={{ flex: 1, marginRight: SPACING.sm }}
                />
                <Button
                  title="Add"
                  variant="outline"
                  size="small"
                  onPress={() => { }}
                  icon={<Feather name="plus" size={16} color={COLORS.textDark} />}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            <View style={styles.card}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Difficulty</Text>
                <View style={styles.selectContainer}>
                  <TouchableOpacity
                    style={[styles.selectOption, difficulty === 'easy' && styles.selectedOption]}
                    onPress={() => setDifficulty('easy')}>
                    <Text
                      style={[
                        styles.selectOptionText,
                        difficulty === 'easy' && styles.selectedOptionText,
                      ]}>
                      Easy
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.selectOption, difficulty === 'medium' && styles.selectedOption]}
                    onPress={() => setDifficulty('medium')}>
                    <Text
                      style={[
                        styles.selectOptionText,
                        difficulty === 'medium' && styles.selectedOptionText,
                      ]}>
                      Medium
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.selectOption, difficulty === 'hard' && styles.selectedOption]}
                    onPress={() => setDifficulty('hard')}>
                    <Text
                      style={[
                        styles.selectOptionText,
                        difficulty === 'hard' && styles.selectedOptionText,
                      ]}>
                      Hard
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Cuisine</Text>
                <Input
                  placeholder="e.g., Italian, Mexican, Indian..."
                  value={cuisine}
                  onChangeText={setCuisine}
                />
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="Save Draft"
              variant="outline"
              onPress={handleSaveDraft}
              style={{ flex: 1, marginRight: SPACING.md }}
            />
            <Button title="Publish Recipe" onPress={handlePublish} style={{ flex: 1 }} />
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
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: FONTS.heading.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  listItemInput: {
    flex: 1,
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.md,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  removeButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  addItemInput: {
    flex: 1,
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.md,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
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
  instructionContent: {
    flex: 1,
  },
  instructionInput: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.md,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  removeInstructionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    alignSelf: 'flex-start',
  },
  removeText: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginRight: SPACING.xs,
  },
  addInstructionContainer: {
    marginTop: SPACING.sm,
  },
  addInstructionInput: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.md,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: SPACING.sm,
  },
  imageUploadContainer: {
    aspectRatio: 3 / 2,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageUploadContent: {
    alignItems: 'center',
  },
  imageUploadTitle: {
    fontFamily: FONTS.body.medium,
    fontSize: SIZES.md,
    color: COLORS.textDark,
    marginTop: SPACING.sm,
  },
  imageUploadSubtitle: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  imageUploadHint: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.md,
  },
  addTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectOption: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  selectOptionText: {
    fontFamily: FONTS.body.medium,
    fontSize: SIZES.sm,
    color: COLORS.textDark,
  },
  selectedOptionText: {
    color: COLORS.white,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
  },
});

export default CreateRecipeScreen;