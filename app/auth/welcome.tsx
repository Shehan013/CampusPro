import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

export default function WelcomeScreen() {
  const { colors, toggleTheme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Theme Toggle Button */}
      <TouchableOpacity
        style={[styles.themeToggle, { backgroundColor: colors.surface }]}
        onPress={toggleTheme}
      >
        <Feather 
          name={isDark ? 'sun' : 'moon'} 
          size={24} 
          color={colors.primary} 
        />
      </TouchableOpacity>

      {/* Logo Section */}
      <View style={styles.logoSection}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
          <Feather name="calendar" size={60} color="#FFFFFF" />
        </View>
        <Text style={[styles.appName, { color: colors.text }]}>
          CampusPro
        </Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Manage Your Campus Events
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/auth/signup' as any)}
        >
          <Text style={styles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { 
            backgroundColor: colors.surface,
            borderColor: colors.border 
          }]}
          onPress={() => router.push('/auth/login' as any)}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  themeToggle: {
    position: 'absolute',
    top: 60,
    right: Spacing.lg,
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl * 2,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    textAlign: 'center',
  },
  buttonSection: {
    width: '100%',
    gap: Spacing.md,
  },
  primaryButton: {
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  secondaryButton: {
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
});
