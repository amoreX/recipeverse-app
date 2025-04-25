import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const SkeletonCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.textLineShort} />
      <View style={styles.textLineLong} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: COLORS.skeleton,
    borderRadius: 10,
    marginBottom: SPACING.sm,
  },
  textLineShort: {
    height: 12,
    width: '40%',
    backgroundColor: COLORS.skeleton,
    borderRadius: 6,
    marginBottom: SPACING.xs,
  },
  textLineLong: {
    height: 12,
    width: '80%',
    backgroundColor: COLORS.skeleton,
    borderRadius: 6,
  },
});

export default SkeletonCard;
