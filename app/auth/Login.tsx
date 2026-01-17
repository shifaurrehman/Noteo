import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import GradientButton from "@/components/auth/CustomButton";
import AuthInput from "@/components/auth/AuthEmail";
import { validateEmail } from "@/utilities/auth";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempted, setLoginAttempted] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "", });
  const { loading, login, isAuthenticated } = useAuth();

  const validateInputFields = () => {
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
  };
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
  }, [email, password, login]);

  useEffect(() => {
    if (loginAttempted && isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, loginAttempted, router]);

  const handleGuest = async () => {};

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
                <Ionicons name="book" size={40} color="#fff" />
              </LinearGradient>
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
            />

            {/* Password Input */}
            <AuthInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => handleChange("password", text)}
              error={errors.password}
              iconName="lock-closed-outline"
              secureTextEntry
            />

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <GradientButton title="Sign In" loading={loading} onPress={handleLogin} />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            {/* Guest Button */}
            <TouchableOpacity
              onPress={handleGuest}
              style={styles.guestButton}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Ionicons name="person-outline" size={20} color="#667eea" />
              <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerPrompt}>{`Don't have an account? `}</Text>
              <TouchableOpacity onPress={() => router.push("/auth/Register")}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
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
    fontSize: 32,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 12,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e9ecef",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#6c757d",
    fontSize: 14,
    fontWeight: "500",
  },
  guestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "#667eea",
  },
  guestText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  registerPrompt: {
    color: "#6c757d",
    fontSize: 15,
  },
  registerLink: {
    color: "#667eea",
    fontSize: 15,
    fontWeight: "700",
  },
});
