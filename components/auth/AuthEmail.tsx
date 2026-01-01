// components/auth/AuthInput.tsx
import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AuthInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  iconName?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
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
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;

  return (
    <View style={{ marginBottom: 10 }}>
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        {iconName && (
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={20} color="#667eea" />
          </View>
        )}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#a0a0a0"
          keyboardType={keyboardType}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#a0a0a0" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default AuthInput;

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  iconContainer: {
    marginRight: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 13,
    marginTop: 2,
    marginLeft: 4,
  },
});
