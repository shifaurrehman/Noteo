import { Alert, Platform, ToastAndroid } from "react-native";
import * as Haptics from "expo-haptics";

export const showValidationToast = (message: string) => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("Validation", message);
  }
};
