import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "@/theme";

export default function AuthLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="login-screen"
        options={{ headerShown: false, animation: "flip" }}
      />
      <Stack.Screen
        name="register-screen"
        options={{
          headerTitle: "Registro",
          headerTitleStyle: {
            fontFamily: "Comfortaa-Bold",
            color: colors.secondary,
            fontSize: 14,
          },
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={20}
                color={colors.secondary}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
          animation: "fade_from_bottom",
        }}
      />
    </Stack>
  );
}
