import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, TextInput, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

import { AuthStackParamList } from '@navigation/AuthNavigator';
import { theme, spacing, typography } from '@constants/theme';
import { useAuth } from '@/providers/AuthProvider';

type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInScreen: React.FC = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);

      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'You have been successfully signed in.',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: error.message || 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleBack = () => {
    navigation.navigate('Welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Button
              mode="text"
              onPress={handleBack}
              contentStyle={styles.backButtonContent}
              style={styles.backButton}
            >
              <Icon name="arrow-left" size={24} color={theme.colors.primary} />
            </Button>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue managing your shared expenses
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    mode="outlined"
                    label="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    style={styles.input}
                    left={<TextInput.Icon icon="email" />}
                  />
                  {errors.email && (
                    <HelperText type="error" visible={!!errors.email}>
                      {errors.email.message}
                    </HelperText>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    mode="outlined"
                    label="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.password}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    textContentType="password"
                    style={styles.input}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                  />
                  {errors.password && (
                    <HelperText type="error" visible={!!errors.password}>
                      {errors.password.message}
                    </HelperText>
                  )}
                </View>
              )}
            />

            <Button
              mode="text"
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Forgot Password',
                  text2: 'Password reset functionality coming soon!',
                });
              }}
              style={styles.forgotPassword}
              labelStyle={styles.forgotPasswordText}
            >
              Forgot your password?
            </Button>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isLoading}
              loading={isLoading}
              style={[
                styles.signInButton,
                (!isValid || isLoading) && styles.disabledButton,
              ]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.signInButtonText}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              mode="outlined"
              onPress={handleSignUp}
              style={styles.signUpButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.signUpButtonText}
              disabled={isLoading}
            >
              Create Account
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
    marginLeft: -spacing.sm,
  },
  backButtonContent: {
    paddingVertical: spacing.xs,
  },
  title: {
    ...typography.largeTitle,
    color: theme.colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
  forgotPasswordText: {
    ...typography.footnote,
    color: theme.colors.primary,
  },
  actions: {
    paddingBottom: spacing.xl,
  },
  signInButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  disabledButton: {
    backgroundColor: theme.colors.neutral,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  signInButtonText: {
    ...typography.headline,
    color: theme.colors.surface,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.divider,
  },
  dividerText: {
    ...typography.footnote,
    color: theme.colors.textSecondary,
    paddingHorizontal: spacing.md,
  },
  signUpButton: {
    borderColor: theme.colors.primary,
    borderRadius: 12,
  },
  signUpButtonText: {
    ...typography.headline,
    color: theme.colors.primary,
  },
});