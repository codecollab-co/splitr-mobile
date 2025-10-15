import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthStackParamList } from '@navigation/AuthNavigator';
import { theme, spacing, typography } from '@constants/theme';

const { width, height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Icon name={icon} size={32} color={theme.colors.primary} />
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.logoContainer}
          >
            <Text style={styles.logo}>$</Text>
          </LinearGradient>

          <Text style={styles.appName}>Splitr</Text>
          <Text style={styles.tagline}>
            Split expenses fairly with friends, family, and groups
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="account-group"
            title="Group Management"
            description="Create groups for trips, households, or any shared expenses"
          />

          <FeatureItem
            icon="calculator"
            title="Smart Splitting"
            description="Split bills equally, by exact amounts, or custom percentages"
          />

          <FeatureItem
            icon="credit-card"
            title="Easy Settlement"
            description="Track who owes what and settle up with integrated payments"
          />

          <FeatureItem
            icon="chart-line"
            title="Expense Insights"
            description="Visualize spending patterns with detailed analytics"
          />

          <FeatureItem
            icon="sync"
            title="Real-time Sync"
            description="All changes sync instantly across all devices"
          />
        </View>

        {/* CTA Section */}
        <View style={styles.ctaContainer}>
          <Button
            mode="contained"
            onPress={handleSignUp}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.primaryButtonText}
          >
            Get Started
          </Button>

          <Button
            mode="outlined"
            onPress={handleSignIn}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.secondaryButtonText}
          >
            Sign In
          </Button>

          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.surface,
  },
  appName: {
    ...typography.largeTitle,
    color: theme.colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    lineHeight: 24,
  },
  featuresContainer: {
    paddingVertical: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  featureTitle: {
    ...typography.headline,
    color: theme.colors.textPrimary,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  ctaContainer: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  secondaryButton: {
    borderColor: theme.colors.primary,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  primaryButtonText: {
    ...typography.headline,
    color: theme.colors.surface,
  },
  secondaryButtonText: {
    ...typography.headline,
    color: theme.colors.primary,
  },
  disclaimer: {
    ...typography.footnote,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
});