import AuthInput from "@/components/auth/AuthEmail";
import GradientButton from "@/components/auth/CustomButton";
import { resendVerificationEmailApi, verifyEmailApi } from "@/services/api/services/authService";
import { tokenStorage } from "@/services/storage/tokenStorage";
import { setUser } from "@/store/slices/authSlice";
import { useNavigation } from "@/utilities/routes/Routes";
import { getErrorMessage } from "@/utilities/toast/get-toast-message";
import { showErrorToast, showSuccessToast } from "@/utilities/toast/message-toast";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function VerifyEmailScreen() {
    const router = useRouter();
    const { redirectHome, redirectLogin } = useNavigation();
    const { email } = useLocalSearchParams<{ email: string }>();
    const dispatch = useDispatch();

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
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
            <LinearGradient colors={["#667eea", "#764ba2", "#f093fb"]} style={styles.gradient}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Section */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.iconContainer}>
                            <LinearGradient colors={["#ff6b9d", "#c86dd7"]} style={styles.iconGradient}>
                                <Ionicons name="mail-unread-outline" size={40} color="#fff" />
                            </LinearGradient>
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
                        />

                        {/* Verify Button */}
                        <GradientButton title="Verify Account" loading={isLoading} onPress={handleVerify} />

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
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === "ios" ? 60 : 40,
        paddingBottom: 40,
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    backButton: {
        position: "absolute",
        left: 0,
        top: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    iconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 12,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.85)",
        textAlign: "center",
        lineHeight: 24,
    },
    emailText: {
        fontWeight: "bold",
        color: "#fff",
    },
    formContainer: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    resendContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
    },
    resendPrompt: {
        color: "#6c757d",
        fontSize: 15,
    },
    resendLink: {
        color: "#667eea",
        fontSize: 15,
        fontWeight: "700",
    },
    disabledText: {
        opacity: 0.5,
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
    },
    loginLink: {
        color: "#667eea",
        fontSize: 15,
        fontWeight: "600",
    },
});
