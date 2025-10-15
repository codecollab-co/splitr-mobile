import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, TextInput, HelperText, Checkbox } from 'react-native-paper';
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

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

const signUpSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);

      // In a real app, this would create a new user account via Clerk
      // For now, we'll simulate the registration process
      await new Promise(resolve => setTimeout(resolve, 2000));

      Toast.show({
        type: 'success',
        text1: 'Welcome to Splitr!',
        text2: 'Your account has been created successfully.',
      });

      // After successful registration, sign the user in
      await login(data.email, data.password);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: error.message || 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
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

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join thousands of users who split expenses effortlessly
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    mode="outlined"
                    label="Full Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.name}
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    style={styles.input}
                    left={<TextInput.Icon icon="account" />}
                  />
                  {errors.name && (
                    <HelperText type="error" visible={!!errors.name}>
                      {errors.name.message}
                    </HelperText>
                  )}
                </View>
              )}
            />

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
                    autoComplete="new-password"
                    textContentType="newPassword"
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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    mode="outlined"
                    label="Confirm Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={!!errors.confirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    style={styles.input}
                    left={<TextInput.Icon icon="lock-check" />}
                    right={
                      <TextInput.Icon
                        icon={showConfirmPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    }
                  />
                  {errors.confirmPassword && (
                    <HelperText type="error" visible={!!errors.confirmPassword}>
                      {errors.confirmPassword.message}
                    </HelperText>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="agreeToTerms"
              render={({ field: { onChange, value } }) => (
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    status={value ? 'checked' : 'unchecked'}
                    onPress={() => onChange(!value)}
                    color={theme.colors.primary}
                  />
                  <View style={styles.checkboxTextContainer}>
                    <Text style={styles.checkboxText}>
                      I agree to the{' '}
                      <Text
                        style={styles.linkText}
                        onPress={() =>
                          Toast.show({
                            type: 'info',
                            text1: 'Terms of Service',
                            text2: 'Terms and Privacy Policy coming soon!',
                          })
                        }
                      >
                        Terms of Service
                      </Text>{' '}
                      and{' '}
                      <Text
                        style={styles.linkText}
                        onPress={() =>
                          Toast.show({
                            type: 'info',
                            text1: 'Privacy Policy',
                            text2: 'Privacy Policy coming soon!',
                          })
                        }
                      >
                        Privacy Policy
                      </Text>
                    </Text>
                    {errors.agreeToTerms && (
                      <HelperText type="error" visible={!!errors.agreeToTerms}>
                        {errors.agreeToTerms.message}
                      </HelperText>
                    )}
                  </View>
                </View>
              )}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isLoading}
              loading={isLoading}
              style={[
                styles.signUpButton,
                (!isValid || isLoading) && styles.disabledButton,
              ]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.signUpButtonText}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              mode="outlined"
              onPress={handleSignIn}
              style={styles.signInButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.signInButtonText}
              disabled={isLoading}
            >
              Sign In to Existing Account
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
    marginBottom: spacing.xl,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.md,
  },
  checkboxTextContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  checkboxText: {
    ...typography.footnote,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  actions: {
    paddingBottom: spacing.xl,
  },
  signUpButton: {
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
  signUpButtonText: {
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
  signInButton: {
    borderColor: theme.colors.primary,
    borderRadius: 12,
  },
  signInButtonText: {
    ...typography.headline,
    color: theme.colors.primary,
  },
});