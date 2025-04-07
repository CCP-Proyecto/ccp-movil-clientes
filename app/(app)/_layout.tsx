import { useState } from "react";
import { Stack } from "expo-router";
import { authClient } from "@/services/auth/auth-client";
import { Redirect } from "expo-router";
import { colors } from "@/theme/colors";
import { LogoutButton } from "@/components";

export default function AppLayout() {
  const { data: session } = authClient.useSession();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleLogoutSuccess = () => {
    setIsLoggedOut(true);
  };

  if (!session || isLoggedOut) {
    return <Redirect href="/(auth)/login-screen" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTitleStyle: {
          fontFamily: "Comfortaa-Bold",
          color: colors.secondary,
          fontSize: 16,
        },
        headerRight: () => (
          <LogoutButton
            onLogoutSuccess={handleLogoutSuccess}
            style={{ marginRight: 15 }}
          />
        ),
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          headerTitle: `Bienvenido, ${session?.user?.name}`,
          headerShown: true,
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="createOrder"
        options={{
          headerTitle: "Creación de pedidos",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
