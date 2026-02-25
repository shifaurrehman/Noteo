import AuthInput from "@/components/auth/AuthEmail";
import GradientButton from "@/components/auth/CustomButton";
import { forgotPasswordApi } from "@/services/api/services/authService";
import { validateEmail } from "@/utilities/auth";
import { showErrorToast, showSuccessToast } from "@/utilities/toast/message-toast";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ForgotPasswordScreen() {
    const router = useRouter();
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
            router.push({
                pathname: "/auth/reset-password",
                params: { email },
            });
        } catch (err) {
            console.error(err);
            showErrorToast({ title: "Error", message: "Failed to send OTP. Please try again." });
        } finally {
            setLoading(false);
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
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.iconContainer}>
                            <LinearGradient colors={["#ff6b9d", "#c86dd7"]} style={styles.iconGradient}>
                                <Ionicons name="key-outline" size={40} color="#fff" />
                            </LinearGradient>
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
                        />

                        {/* Send Code Button */}
                        <GradientButton title="Send Code" loading={loading} onPress={handleSendCode} />

                        {/* Back to Login */}
                        <TouchableOpacity onPress={() => router.back()} style={styles.backLinkContainer}>
                            <Text style={styles.backLinkText}>Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === "ios" ? 60 : 40,
        paddingBottom: 40,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
        marginTop: 20,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        padding: 8,
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
        fontSize: 28,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.85)",
        textAlign: "center",
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
    backLinkContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    backLinkText: {
        color: "#667eea",
        fontSize: 16,
        fontWeight: "600",
    }
});
