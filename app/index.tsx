import 'react-native-get-random-values';
import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useAppSelector } from "@/store/hooks";
import { selectColors, selectIsAuthenticated, selectUser } from "@/store/selectors";
import { RedirectHome } from "@/utilities/routes/Routes";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  // selectors
  const colors = useAppSelector(selectColors);
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
      let nextRoute: "/auth/Login" | "/(tabs)/home" = "/auth/Login";

      if (user) {
        if (!user.registered) {
          nextRoute = "/(tabs)/home"
        } else if (user.registered && isAuthenticated) {
          nextRoute = "/(tabs)/home"
        }
      }

      router.replace(nextRoute);
    }, 3000);

    return () => clearTimeout(timer);
  }, [user, isAuthenticated, router]);

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

      <Text style={[styles.appName, { color: colors.primary }]}>AI Note Taker</Text>
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
