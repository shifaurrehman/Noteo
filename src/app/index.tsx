import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated, selectUser } from "@/store/selectors";
import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text } from "react-native";
import 'react-native-get-random-values';

const { width } = Dimensions.get("window");
export default function SplashScreen() {
  const router = useRouter();
  // selectors
  const { colors } = useTheme();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Animated scale
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 2,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace("/(app)/(tabs)/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [user, isAuthenticated, router, scaleAnim]);

  const gradientColors: [string, string, string] = ["#1c1c1e", "#5a00ff", "#ff008c"]


  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
      locations={[0,0.5, 1]} // first color ends at 80%, second starts at 80%
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LottieView
          ref={lottieRef}
          source={require("../assets/lottie/notes.json")} // your Lottie file
          autoPlay
          loop={true}
          style={styles.lottie}
        />
      </Animated.View>

      <Text style={[styles.appName, { color: colors.primary }]}>Noteo</Text>
      <Text style={[styles.tagline, { color: "#ccc" }]}>Your smart notes companion</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width,
  },
  lottie: {
    width: width * 0.512,
    height: width * 0.512,
    marginBottom: 20,
  },
  appName: {
    fontSize: width * 0.068,
    fontWeight: "700",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
  },
});
