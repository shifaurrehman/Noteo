import AuthInput from "@/components/auth/AuthEmail";
import PrimaryButton from "@/components/button/PrimaryButton";
import { useAuth } from "@/hooks/useAuth";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { validateEmail } from "@/utilities/auth";
import { useNavigation } from "@/utilities/routes/Routes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import type { ThemeColors } from "@/theme/colors";

const createLoginStyles = (colors: ThemeColors) => {
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
      marginBottom: 40,
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
    forgotPassword: {
      alignSelf: "flex-end" as const,
      marginTop: 12,
      marginBottom: 24,
    },
    forgotPasswordText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "600" as const,
    },
    registerContainer: {
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginTop: 24,
    },
    registerPrompt: {
      color: colors.textSecondary,
      fontSize: 15,
    },
    registerLink: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "700" as const,
    },
  };
};

export default function LoginScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const styles = createLoginStyles(colors);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginAttempted, setLoginAttempted] = useState(false);
    const { redirectHome, redirectRegister, redirectForgotPassword } = useNavigation();
    const dispatch = useDispatch();

    const [errors, setErrors] = useState({ email: "", password: "", });
    const { loading, login, isAuthenticated } = useAuth();

    const validateInputFields = useCallback(() => {
        const newErrors = { email: "", password: "" };
        let isValid = true;

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
        }

        setErrors(newErrors);
        return isValid;
    }, [email, password]);

    const handleChange = (field: keyof typeof errors, value: string) => {
        if (field === "email") setEmail(value);
        if (field === "password") setPassword(value);
        setErrors({ ...errors, [field]: "" });
    };

    const handleLogin = useCallback(() => {
        const isValid = validateInputFields();
        if (!isValid) return;
        Keyboard.dismiss();
        setLoginAttempted(true)
        login({ email, password });
    }, [email, password, login, validateInputFields]);

    useEffect(() => {
        if (loginAttempted && isAuthenticated) {
            redirectHome();
            dispatch(fetchCategories());
        }
    }, [isAuthenticated, loginAttempted, redirectHome, dispatch]);

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
                                <Ionicons name="book" size={40} color={colors.primary} />
                            </View>
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue your journey</Text>
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
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

                        {/* Forgot Password */}
                        <TouchableOpacity
                            style={styles.forgotPassword}
                            onPress={() => redirectForgotPassword()}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <PrimaryButton title="Sign In" loading={loading} onPress={handleLogin} colors={colors} />

                        {/* Register Link */}
                        <View style={styles.registerContainer}>
                            <Text style={styles.registerPrompt}>{`Don't have an account? `}</Text>
                            <TouchableOpacity onPress={() => redirectRegister()}>
                                <Text style={styles.registerLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
