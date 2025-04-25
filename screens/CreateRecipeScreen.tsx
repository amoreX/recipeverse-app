"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../constants/types"
import { COLORS, FONTS, SIZES, SPACING } from "../constants/theme"
import Button from "../components/Button"
import Input from "../components/Input"
import TagChip from "../components/TagChip"

// Mock data
const popularTags = ["Seasonal", "Vegetarian", "Dessert", "Baking", "Healthy", "Quick", "Gluten-Free"]

const CreateRecipeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [servings, setServings] = useState("")
  const [ingredients, setIngredients] = useState<string[]>(["500g all-purpose flour", "10g salt"])
  const [instructions, setInstructions] = useState<string[]>([
    "Preheat oven to 350°F (175°C).",
    "Mix all ingredients in a large bowl.",
  ])
  const [selectedTags, setSelectedTags] = useState<string[]>(["Seasonal"])
  const [newIngredient, setNewIngredient] = useState("")
  const [newInstruction, setNewInstruction] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [cuisine, setCuisine] = useState("")

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const updateIngredient = (text: string, index: number) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = text
    setIngredients(newIngredients)
  }

  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients]
    newIngredients.splice(index, 1)
    setIngredients(newIngredients)
  }

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()])
      setNewIngredient("")
    }
  }

  const updateInstruction = (text: string, index: number) => {
    const newInstructions = [...instructions]
    newInstructions[index] = text
    setInstructions(newInstructions)
  }

  const removeInstruction = (index: number) => {
    const newInstructions = [...instructions]
    newInstructions.splice(index, 1)
    setInstructions(newInstructions)
  }

  const addInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction.trim()])
      setNewInstruction("")
    }
  }

  const handleSaveDraft = () => {
    // In a real app, this would save to the database
    navigation.navigate("Main", { screen: "Profile" })
  }

  const handlePublish = () => {
    // In a real app, this would validate and publish the recipe
    navigation.navigate("Main", { screen: "Profile" })
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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
                <Input placeholder="e.g., Homemade Sourdough Bread" value={title} onChangeText={setTitle} />
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
                  <Input placeholder="45" value={cookTime} onChangeText={setCookTime} keyboardType="numeric" />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Servings</Text>
                  <Input placeholder="4" value={servings} onChangeText={setServings} keyboardType="numeric" />
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
                    value={ingredient}
                    onChangeText={(text) => updateIngredient(text, index)}
                    placeholder="Add ingredient..."
                  />
                  <TouchableOpacity style={styles.removeButton} onPress={() => removeIngredient(index)}>
                    <Feather name="trash-2" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.addItemContainer}>
                <TextInput
                  style={styles.addItemInput}
                  value={newIngredient}
                  onChangeText={setNewIngredient}
                  placeholder="Add new ingredient..."
                  onSubmitEditing={addIngredient}
                />
                <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
                  <Feather name="plus" size={18} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.card}>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.instructionContent}>
                    <TextInput
                      style={styles.instructionInput}
                      value={instruction}
                      onChangeText={(text) => updateInstruction(text, index)}
                      placeholder="Add instruction step..."
                      multiline
                    />
                    <TouchableOpacity style={styles.removeInstructionButton} onPress={() => removeInstruction(index)}>
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
              <TouchableOpacity style={styles.imageUploadContainer}>
                <View style={styles.imageUploadContent}>
                  <Feather name="upload" size={32} color={COLORS.textMuted} />
                  <Text style={styles.imageUploadTitle}>Upload Recipe Image</Text>
                  <Text style={styles.imageUploadSubtitle}>Tap to browse your photos</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.imageUploadHint}>Recommended size: 1200 x 800 pixels (3:2 ratio)</Text>
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
                <Input placeholder="Add custom tag..." containerStyle={{ flex: 1, marginRight: SPACING.sm }} />
                <Button
                  title="Add"
                  variant="outline"
                  size="small"
                  onPress={() => {}}
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
                    style={[styles.selectOption, difficulty === "easy" && styles.selectedOption]}
                    onPress={() => setDifficulty("easy")}
                  >
                    <Text style={[styles.selectOptionText, difficulty === "easy" && styles.selectedOptionText]}>
                      Easy
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.selectOption, difficulty === "medium" && styles.selectedOption]}
                    onPress={() => setDifficulty("medium")}
                  >
                    <Text style={[styles.selectOptionText, difficulty === "medium" && styles.selectedOptionText]}>
                      Medium
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.selectOption, difficulty === "hard" && styles.selectedOption]}
                    onPress={() => setDifficulty("hard")}
                  >
                    <Text style={[styles.selectOptionText, difficulty === "hard" && styles.selectedOptionText]}>
                      Hard
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Cuisine</Text>
                <Input placeholder="e.g., Italian, Mexican, Indian..." value={cuisine} onChangeText={setCuisine} />
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: SPACING.md,
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
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
    textAlignVertical: "top",
  },
  removeInstructionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.xs,
    alignSelf: "flex-start",
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
    textAlignVertical: "top",
    marginBottom: SPACING.sm,
  },
  imageUploadContainer: {
    aspectRatio: 3 / 2,
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imageUploadContent: {
    alignItems: "center",
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
    textAlign: "center",
    marginTop: SPACING.sm,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: SPACING.md,
  },
  addTagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  selectOption: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: "center",
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
    flexDirection: "row",
    marginBottom: SPACING.xl,
  },
})

export default CreateRecipeScreen
