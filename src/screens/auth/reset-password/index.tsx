import AuthInput from "@/components/auth/AuthEmail";
import PrimaryButton from "@/components/button/PrimaryButton";
import { resetPasswordApi } from "@/services/api/services/authService";
import { useNavigation } from "@/utilities/routes/Routes";
import { showErrorToast, showSuccessToast } from "@/utilities/toast/message-toast";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
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

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const createResetPasswordStyles = (colors: ThemeColors) => {
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
      backgroundColor: colors.surface,
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
    passwordHint: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 10,
      marginTop: -5,
      marginLeft: 5
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

export default function ResetPasswordScreen() {
    const { redirectLogin } = useNavigation();
    const { colors } = useTheme();
    const styles = createResetPasswordStyles(colors);
    const { email } = useLocalSearchParams<{ email: string }>();
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ otp: "", newPassword: "" });

    const validate = () => {
        let isValid = true;
        const newErrors = { otp: "", newPassword: "" };

        if (!otp.trim()) {
            newErrors.otp = "OTP is required";
            isValid = false;
        } else if (otp.length !== 6) {
            newErrors.otp = "OTP must be 6 digits";
            isValid = false;
        }

        if (!newPassword.trim()) {
            newErrors.newPassword = "Password is required";
            isValid = false;
        } else if (!PASSWORD_REGEX.test(newPassword)) {
            newErrors.newPassword =
                "Password must be 8+ chars, with uppercase, lowercase, number, and special char.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleResetPassword = async () => {
        if (!validate()) return;
        if (!email) {
            showErrorToast({ title: "Error", message: "Email is missing from navigation params." });
            return;
        }

        setLoading(true);

        try {
            await resetPasswordApi({ email, otp, newPassword });
            showSuccessToast({ title: "Success", message: "Password reset successful! Please login." });
            redirectLogin();
        } catch (err) {
            console.error(err);
            showErrorToast({ title: "Error", message: "Invalid or expired OTP" });
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
                        <View style={styles.iconContainer}>
                            <View style={styles.iconWrapper}>
                                <Ionicons name="lock-open-outline" size={40} color={colors.primary} />
                            </View>
                        </View>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>{`Enter the code sent to ${email || "your email"} and a new password.`}</Text>
                    </View>

                    {/* Form Container */}
                    <View style={styles.formContainer}>
                        {/* OTP Input */}
                        <AuthInput
                            placeholder="OTP Code (6 digits)"
                            value={otp}
                            onChangeText={(text) => {
                                setOtp(text);
                                setErrors((prev) => ({ ...prev, otp: "" }));
                            }}
                            error={errors.otp}
                            iconName="keypad-outline"
                            keyboardType="numeric"
                            colors={colors}
                        />

                        {/* New Password Input */}
                        <AuthInput
                            placeholder="New Password"
                            value={newPassword}
                            onChangeText={(text) => {
                                setNewPassword(text);
                                setErrors((prev) => ({ ...prev, newPassword: "" }));
                            }}
                            error={errors.newPassword}
                            iconName="lock-closed-outline"
                            secureTextEntry
                            colors={colors}
                        />
                        {errors.newPassword ? (
                            <Text style={styles.passwordHint}>
                                Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
                            </Text>
                        ) : null}


                        <View style={{ height: 20 }} />

                        {/* Reset Button */}
                        <PrimaryButton title="Reset Password" loading={loading} onPress={handleResetPassword} colors={colors} />

                        {/* Back to Login */}
                        <TouchableOpacity onPress={redirectLogin} style={styles.backLinkContainer}>
                            <Text style={styles.backLinkText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
