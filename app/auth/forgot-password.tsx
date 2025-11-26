import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Feather } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useTheme } from '@/contexts/ThemeContext';
import { auth } from '@/config/firebase';
import CustomInput from '@/components/CustomInput';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { handleError } from '../../utils/errorHandler';

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
});

type ForgotPasswordData = {
  email: string;
};

export default function ForgotPasswordScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, data.email);
      setEmailSent(true);
    } catch (error: any) {
      const errorMessage = handleError(error, 'Forgot Password');
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = getValues('email');
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent again!');
    } catch (error: any) {
      const errorMessage = handleError(error, 'Resend Email');
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.surface }]}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeButton, { backgroundColor: colors.surface }]}
          >
            <Feather name={isDark ? "sun" : "moon"} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {!emailSent ? (
          <>
            {/* Title */}
            <View style={styles.titleContainer}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
                <Feather name="lock" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>Forgot Password?</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Enter your email address and we'll send you instructions to reset your password
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Email Address"
                    placeholder="Enter your email"
                    icon="mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                  />
                )}
              />

              <TouchableOpacity
                style={[
                  styles.resetButton,
                  { backgroundColor: colors.primary },
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.resetButtonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backToLogin}
                onPress={() => router.back()}
              >
                <Feather name="arrow-left" size={16} color={colors.primary} />
                <Text style={[styles.backToLoginText, { color: colors.primary }]}>
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Success Message */}
            <View style={styles.successContainer}>
              <View style={[styles.successIconCircle, { backgroundColor: '#10B981' + '20' }]}>
                <Feather name="check-circle" size={48} color="#10B981" />
              </View>
              <Text style={[styles.successTitle, { color: colors.text }]}>Check Your Email</Text>
              <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
                We've sent password reset instructions to:
              </Text>
              <Text style={[styles.emailText, { color: colors.primary }]}>
                {getValues('email')}
              </Text>
              <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                Click the link in the email to reset your password. You'll be asked to enter your new password twice for confirmation. If you don't see the email, check your spam folder.
              </Text>

              <TouchableOpacity
                style={[
                  styles.resendButton,
                  { backgroundColor: colors.surface, borderColor: colors.primary },
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleResendEmail}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <>
                    <Feather name="refresh-cw" size={18} color={colors.primary} />
                    <Text style={[styles.resendButtonText, { color: colors.primary }]}>
                      Resend Email
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.doneButton, { backgroundColor: colors.primary }]}
                onPress={() => router.replace('/auth/login' as any)}
              >
                <Text style={styles.doneButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  resetButton: {
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  backToLogin: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  backToLoginText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  successContainer: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emailText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  instructionText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xxl,
  },
  resendButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    width: '100%',
  },
  resendButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  doneButton: {
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
});
