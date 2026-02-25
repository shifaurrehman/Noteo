import { isWeb } from "@/utilities/global";
import { View } from "react-native";

export default function WebContainer({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        alignSelf: "center",
        maxWidth: isWeb ? 1200 : "100%",
        paddingHorizontal: isWeb ? 24 : 16,
      }}
    >
      {children}
    </View>
  );
}
