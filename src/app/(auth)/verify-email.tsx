import AuthInput from "@/components/auth/AuthEmail";
import PrimaryButton from "@/components/button/PrimaryButton";
import { resendVerificationEmailApi, verifyEmailApi } from "@/services/api/services/authService";
import { tokenStorage } from "@/services/storage/tokenStorage";
import { setUser } from "@/store/slices/authSlice";
import { useNavigation } from "@/utilities/routes/Routes";
import { getErrorMessage } from "@/utilities/toast/get-toast-message";
import { showErrorToast, showSuccessToast } from "@/utilities/toast/message-toast";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
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
import { useDispatch } from "react-redux";

const createVerifyEmailStyles = (colors: ThemeColors) => {
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
      top: 0,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + "20",
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    iconContainer: {
      marginBottom: 20,
      marginTop: 20,
    },
    iconWrapper: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      backgroundColor: colors.primary + "20",
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
      marginBottom: 12,
      textAlign: "center" as const,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center" as const,
      lineHeight: 24,
    },
    emailText: {
      fontWeight: "bold" as const,
      color: colors.textMain,
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
    resendContainer: {
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginTop: 24,
    },
    resendPrompt: {
      color: colors.textSecondary,
      fontSize: 15,
    },
    resendLink: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "700" as const,
    },
    disabledText: {
      opacity: 0.5,
    },
    loginContainer: {
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginTop: 16,
    },
    loginLink: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "600" as const,
    },
  };
};

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { redirectHome, redirectLogin } = useNavigation();
  const { email } = useLocalSearchParams<{ email: string }>();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = createVerifyEmailStyles(colors);

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError("Verification code is required");
      return;
    }
    if (otp.length < 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const response = await verifyEmailApi({ email: email || "", otp });
      await tokenStorage.saveTokens(response.accessToken, response.refreshToken);
      const user = { ...response.user, registered: true };
      dispatch(setUser(user));

      showSuccessToast({ message: "Email verified successfully!" });
      redirectHome();
    } catch (error: any) {
      const message = getErrorMessage(error) || "Invalid or expired verification code";
      setError(message);
      showErrorToast({ message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerificationEmailApi({ email: email || "" });
      showSuccessToast({ message: "Verification code sent to your email" });
      setError("");
    } catch (error: any) {
      const message = getErrorMessage(error) || "Failed to resend code";
      showErrorToast({ message });
    } finally {
      setIsResending(false);
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
                <Ionicons name="mail-unread-outline" size={40} color={colors.primary} />
              </View>
            </View>
            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.subtitle}>
              Please enter the 6-digit verification code sent to{`\n`}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* OTP Input */}
            <AuthInput
              placeholder="Enter 6-digit code"
              value={otp}
              onChangeText={(text) => {
                setOtp(text);
                setError("");
              }}
              error={error}
              iconName="keypad-outline"
              keyboardType="number-pad"
              maxLength={6}
              colors={colors}
            />

            {/* Verify Button */}
            <PrimaryButton title="Verify Account" loading={isLoading} onPress={handleVerify} colors={colors} />

            {/* Resend Link */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendPrompt}>Didn&apos;t receive the code? </Text>
              <TouchableOpacity onPress={handleResend} disabled={isResending}>
                <Text style={[styles.resendLink, isResending && styles.disabledText]}>
                  {isResending ? "Sending..." : "Resend Code"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <TouchableOpacity onPress={() => redirectLogin()}>
                <Text style={styles.loginLink}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
