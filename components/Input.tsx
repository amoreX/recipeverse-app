'use client';

import type React from 'react';
import { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  type ViewStyle,
  type TextStyle,
  type TextInputProps,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  secureTextEntry?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  labelStyle,
  inputStyle,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
        ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            !!leftIcon && { paddingLeft: 40 },
            !!(rightIcon || secureTextEntry) && { paddingRight: 40 },
            inputStyle,
          ].filter(Boolean)}
          placeholderTextColor={COLORS.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry ? !isPasswordVisible : false}
          // Ensure boolean value
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity style={styles.rightIcon} onPress={togglePasswordVisibility}>
            <Feather
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontFamily: FONTS.body.medium,
    fontSize: SIZES.sm,
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.md,
    color: COLORS.textDark,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  focusedInput: {
    borderColor: COLORS.primary,
  },
  errorInput: {
    borderColor: COLORS.error,
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
  errorText: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default Input;
