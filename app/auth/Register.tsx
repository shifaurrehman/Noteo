// app/auth/Register.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/slices/authSlice";
import { useAppSelector } from "@/store/hooks";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "@/utilities/auth";
import GradientButton from "@/components/auth/CustomButton";
import AuthInput from "@/components/auth/AuthEmail";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const isLoadingUser = useAppSelector((state) => state.auth.loading);
  const user = useAppSelector((state) => state.auth.user);
  const error = useAppSelector((state) => state.auth.error);
  console.log("loading: ", isLoadingUser, "user: ", user, "error: ", error);

  const dispatch = useDispatch();

  const validateInputFields = () => {
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };

    // Validate inputs
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
    setIsLoading(true);
    dispatch(registerUser({ name, email, password }));
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(tabs)/home");
    }, 1500);
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
                <Ionicons name="person-add" size={40} color="#fff" />
              </LinearGradient>
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
            />
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
            {/* Confirm Password Input */}
            <AuthInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
              error={errors.confirmPassword}
              iconName="shield-checkmark-outline"
              secureTextEntry
            />
            {/* Register Button */}
            <GradientButton title="Sign Up" loading={isLoading} onPress={handleRegister} />
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
  inputIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  strengthContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  strengthBarContainer: {
    height: 4,
    backgroundColor: "#e9ecef",
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthBar: {
    height: "100%",
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    marginLeft: 4,
  },
  termsText: {
    fontSize: 13,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
  termsLink: {
    color: "#667eea",
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginPrompt: {
    color: "#6c757d",
    fontSize: 15,
  },
  loginLink: {
    color: "#667eea",
    fontSize: 15,
    fontWeight: "700",
  },
});
