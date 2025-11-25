import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
}

export default function CustomInput({
  label,
  error,
  icon,
  isPassword = false,
  ...props
}: CustomInputProps) {
  const { colors } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      
      <View style={[
        styles.inputContainer,
        { 
          backgroundColor: colors.inputBackground,
          borderColor: error ? colors.error : colors.inputBorder,
        }
      ]}>
        {icon && (
          <Feather
            name={icon}
            size={20}
            color={error ? colors.error : colors.textMuted}
            style={styles.icon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            { color: colors.inputText },
            icon && styles.inputWithIcon,
          ]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Feather
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 56,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  eyeIcon: {
    padding: Spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  errorText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
  },
});
