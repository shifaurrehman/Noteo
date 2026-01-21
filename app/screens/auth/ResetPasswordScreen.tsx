import AuthInput from "@/components/auth/AuthEmail"; // Reusing AuthInput
import GradientButton from "@/components/auth/CustomButton";
import { resetPasswordApi } from "@/services/api/services/authService";
import { showErrorToast, showSuccessToast } from "@/utilities/toast/message-toast";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
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

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function ResetPasswordScreen() {
    const router = useRouter();
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
            router.replace("/auth/Login"); // Case-sensitive check might be needed
        } catch (err) {
            console.error(err);
            showErrorToast({ title: "Error", message: "Invalid or expired OTP" });
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
                        <View style={styles.iconContainer}>
                            <LinearGradient colors={["#ff6b9d", "#c86dd7"]} style={styles.iconGradient}>
                                <Ionicons name="lock-open-outline" size={40} color="#fff" />
                            </LinearGradient>
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
                        />
                        {errors.newPassword ? (
                            <Text style={styles.passwordHint}>
                                Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
                            </Text>
                        ) : null}


                        <View style={{ height: 20 }} />

                        {/* Reset Button */}
                        <GradientButton title="Reset Password" loading={loading} onPress={handleResetPassword} />

                        {/* Back to Login */}
                        <TouchableOpacity onPress={() => router.replace("/auth/Login")} style={styles.backLinkContainer}>
                            <Text style={styles.backLinkText}>Cancel</Text>
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
    },
    iconContainer: {
        marginBottom: 20,
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
    passwordHint: {
        fontSize: 12,
        color: "#666",
        marginBottom: 10,
        marginTop: -5,
        marginLeft: 5
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
