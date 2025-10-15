import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import { theme, spacing } from '@constants/theme';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...'
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>$</Text>
          </View>

          <Text style={styles.appName}>Splitr</Text>

          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={theme.colors.surface}
              style={styles.spinner}
            />
            <Text style={styles.loadingText}>{message}</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    fontSize: 64,
    fontWeight: '700',
    color: theme.colors.surface,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.surface,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  spinner: {
    marginBottom: spacing.md,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.surface,
    opacity: 0.9,
    textAlign: 'center',
  },
});