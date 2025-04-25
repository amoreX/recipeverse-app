import type React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

interface TagChipProps {
  tag: string;
  active?: boolean;
  small?: boolean;
  variant?: 'default' | 'light';
  onPress?: () => void;
}

const TagChip: React.FC<TagChipProps> = ({
  tag,
  active = false,
  small = false,
  variant = 'default',
  onPress,
}) => {
  const getBackgroundColor = () => {
    if (variant === 'light') return 'rgba(255, 255, 255, 0.2)';
    return active ? COLORS.primary : COLORS.accent;
  };

  const getTextColor = () => {
    if (variant === 'light') return COLORS.white;
    return active ? COLORS.white : COLORS.textDark;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        small && styles.smallContainer,
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}>
      <Text style={[styles.text, { color: getTextColor() }, small && styles.smallText]}>{tag}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  smallContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontFamily: FONTS.body.medium,
    fontSize: SIZES.xs,
  },
  smallText: {
    fontSize: 10,
  },
});

export default TagChip;
