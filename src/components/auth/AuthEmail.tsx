// components/auth/AuthInput.tsx
import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ThemeColors } from "@/theme/colors";

interface AuthInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  iconName?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad";
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
  colors: ThemeColors;
}


const AuthInput: React.FC<AuthInputProps> = ({
  value,
  onChangeText,
  placeholder,
  error,
  iconName,
  keyboardType = "default",
  secureTextEntry = false,
  autoCapitalize = "none",
  maxLength,
  colors,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;
  const styles = createAuthInputStyles(colors);

  return (
    <View style={{ marginBottom: 10 }}>
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        {iconName && (
          <View style={styles.iconContainer}>
            <Ionicons name={iconName as any} size={20} color={colors.primary} />
          </View>
        )}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType={keyboardType}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          maxLength={maxLength}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default AuthInput;

const createAuthInputStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      height: 56,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.textMain,
    },
    inputError: {
      borderColor: colors.error,
    },
    iconContainer: {
      marginRight: 12,
    },
    eyeIcon: {
      padding: 4,
    },
    errorText: {
      color: colors.error,
      fontSize: 13,
      marginTop: 2,
      marginLeft: 4,
    },
  });
