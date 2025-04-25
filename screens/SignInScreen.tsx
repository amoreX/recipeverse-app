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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import Button from '../components/Button';
import Input from '../components/Input';
import axios from 'axios';
import { userStore } from '@/stores/userStore';
import { useRecipeStore } from '@/stores/recipeStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../constants/types';
const SignInScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated, setUser } = userStore();
  const { recipes, publishedRecipes, draftRecipes, setRecipes } = useRecipeStore();
  const handleSignIn = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const res = await axios.post('https://recipev.vercel.app/api/auth', {
        email: email,
        password: password,
      });
      setUser(res.data.userDetails);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      const getRecipes = async () => {
        try {
          const res = await axios.post('https://recipev.vercel.app/api/getRecipes', {
            userId: user?.id,
          });
          const allRecipes = res.data.recipeDetails;
          if (allRecipes) {
            setRecipes(allRecipes);
          }
        } catch (err) {
          console.log(err);
        } finally {
          navigation.navigate('Main', { screen: 'Home' });
        }
      };
      getRecipes();
    }
  }, [isAuthenticated]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>Sign in to your account to continue</Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={16} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Email"
              placeholder="hello@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              leftIcon={<Feather name="mail" size={18} color={COLORS.textMuted} />}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              leftIcon={<Feather name="lock" size={18} color={COLORS.textMuted} />}
            />

            {/* <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity> */}

            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.signInButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  logo: {
    fontFamily: FONTS.heading.semiBold,
    fontSize: SIZES.xxl,
    color: COLORS.textDark,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONTS.heading.semiBold,
    fontSize: SIZES.xl,
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  errorText: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.sm,
    color: COLORS.error,
    marginLeft: SPACING.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md,
  },
  forgotPasswordText: {
    fontFamily: FONTS.body.medium,
    fontSize: SIZES.xs,
    color: COLORS.primary,
  },
  signInButton: {
    marginBottom: SPACING.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginHorizontal: SPACING.sm,
  },
  socialButton: {
    marginBottom: SPACING.md,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: SPACING.sm,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  signUpText: {
    fontFamily: FONTS.body.regular,
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginRight: SPACING.xs,
  },
  signUpLink: {
    fontFamily: FONTS.body.medium,
    fontSize: SIZES.sm,
    color: COLORS.primary,
  },
});

export default SignInScreen;
