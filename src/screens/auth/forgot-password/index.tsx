import AuthInput from "@/components/auth/AuthEmail";
import PrimaryButton from "@/components/button/PrimaryButton";
import { forgotPasswordApi } from "@/services/api/services/authService";
import { validateEmail } from "@/utilities/auth";
import { useNavigation } from "@/utilities/routes/Routes";
import { showErrorToast, showSuccessToast } from "@/utilities/toast/message-toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import type { ThemeColors } from "@/theme/colors";

const createForgotPasswordStyles = (colors: ThemeColors) => {
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
      fontSize: 28,
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
    backLinkContainer: {
      alignItems: "center" as const,
      marginTop: 20,
    },
    backLinkText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "600" as const,
    }
  };
};

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const styles = createForgotPasswordStyles(colors);
    const { redirectResetPassword } = useNavigation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendCode = async () => {
        if (!email.trim()) {
            setError("Email is required");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await forgotPasswordApi({ email });
            showSuccessToast({ title: "OTP Sent", message: "If the email exists, an OTP has been sent." });
            redirectResetPassword(email);
        } catch (err) {
            console.error(err);
            showErrorToast({ title: "Error", message: "Failed to send OTP. Please try again." });
        } finally {
            setLoading(false);
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
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={colors.primary} />
                        </TouchableOpacity>
                        <View style={styles.iconContainer}>
                            <View style={styles.iconWrapper}>
                                <Ionicons name="key-outline" size={40} color={colors.primary} />
                            </View>
                        </View>
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>Enter your email to receive a verification code.</Text>
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
                        {/* Email Input */}
                        <AuthInput
                            placeholder="Email Address"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setError("");
                            }}
                            error={error}
                            iconName="mail-outline"
                            keyboardType="email-address"
                            colors={colors}
                        />

                        {/* Send Code Button */}
                        <PrimaryButton title="Send Code" loading={loading} onPress={handleSendCode} colors={colors} />

                        {/* Back to Login */}
                        <TouchableOpacity onPress={() => router.back()} style={styles.backLinkContainer}>
                            <Text style={styles.backLinkText}>Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
