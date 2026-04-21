import AuthInput from "@/components/auth/AuthEmail";
import PrimaryButton from "@/components/button/PrimaryButton";
import { useAuth } from "@/hooks/useAuth";
import { validateEmail, validateName, validatePassword, } from "@/utilities/auth";
import { useNavigation } from "@/utilities/routes/Routes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import type { ThemeColors } from "@/theme/colors";

const createRegisterStyles = (colors: ThemeColors) => {
  return {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: Platform.OS === "ios" ? 60 : 40,
      paddingBottom: 40,
    },
    header: {
      alignItems: "center" as const,
      marginBottom: 30,
    },
    backButton: {
      position: "absolute" as const,
      left: 0,
      top: -8,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.iconWrapper,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    iconContainer: {
      marginBottom: 20,
    },
    iconWrapper: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      backgroundColor: colors.iconWrapper,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    title: {
      fontSize: 32,
      fontWeight: "700" as const,
      color: colors.textMain,
      marginBottom: 8,
      textAlign: "center" as const,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center" as const,
    },
    formContainer: {
      backgroundColor: colors.iconWrapper,
      borderRadius: 24,
      padding: 24,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
        },
        android: {
          elevation: 10,
        },
      }),
    },
    termsText: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: "center" as const,
      marginTop: 16,
      lineHeight: 18,
    },
    termsLink: {
      color: colors.primary,
      fontWeight: "600" as const,
    },
    loginContainer: {
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginTop: 24,
    },
    loginPrompt: {
      color: colors.textSecondary,
      fontSize: 15,
    },
    loginLink: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "700" as const,
    },
  };
};

export default function RegisterScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const styles = createRegisterStyles(colors);
    const { redirectVerifyEmail } = useNavigation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { loading, error, register } = useAuth();
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const validateInputFields = () => {
        const newErrors = { name: "", email: "", password: "", confirmPassword: "" };

        let isValid = true;

        if (!name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        } else if (!validateName(name)) {
            newErrors.name = "Name must be at least 2 characters";
            isValid = false;
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (!validatePassword(password)) {
            newErrors.password = "Password must be at least 8 characters";
            isValid = false;
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (field: keyof typeof errors, value: string) => {
        if (field === "name") setName(value);
        if (field === "email") setEmail(value);
        if (field === "password") setPassword(value);
        if (field === "confirmPassword") setConfirmPassword(value);

        setErrors({ ...errors, [field]: "" });
    };

    const handleRegister = async () => {
        const isValid = validateInputFields();
        if (!isValid) return;
        register({ name, email, password });
        if(!loading && !error){
            redirectVerifyEmail(email);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Section */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={colors.primary} />
                        </TouchableOpacity>
                        <View style={styles.iconContainer}>
                            <View style={styles.iconWrapper}>
                                <Ionicons name="person-add" size={40} color={colors.primary} />
                            </View>
                        </View>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Sign up to get started</Text>
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
                        {/* Name Input */}
                        <AuthInput
                            placeholder="Full Name"
                            value={name}
                            onChangeText={(text) => handleChange("name", text)}
                            error={errors.name}
                            iconName="person-outline"
                            autoCapitalize="words"
                            colors={colors}
                        />
                        {/* Email Input */}
                        <AuthInput
                            placeholder="Email Address"
                            value={email}
                            onChangeText={(text) => handleChange("email", text)}
                            error={errors.email}
                            iconName="mail-outline"
                            keyboardType="email-address"
                            colors={colors}
                        />
                        {/* Password Input */}
                        <AuthInput
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => handleChange("password", text)}
                            error={errors.password}
                            iconName="lock-closed-outline"
                            secureTextEntry
                            colors={colors}
                        />
                        {/* Confirm Password Input */}
                        <AuthInput
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={(text) => handleChange("confirmPassword", text)}
                            error={errors.confirmPassword}
                            iconName="shield-checkmark-outline"
                            secureTextEntry
                            colors={colors}
                        />
                        {/* Register Button */}
                        <PrimaryButton title="Sign Up" loading={loading} onPress={handleRegister} colors={colors} />
                        {/* Terms and Privacy */}
                        <Text style={styles.termsText}>
                            By signing up, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                            <Text style={styles.termsLink}>Privacy Policy</Text>
                        </Text>
                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginPrompt}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text style={styles.loginLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
