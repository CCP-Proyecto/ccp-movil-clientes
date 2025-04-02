import { Stack } from "expo-router";
import { authClient } from "@/services/auth/auth-client";
import { Redirect } from "expo-router";

export default function AppLayout() {
  const { data: session } = authClient.useSession();

  // Redirige a login si no hay sesión
  if (!session) {
    return <Redirect href="/(auth)/login-screen" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
    </Stack>
  );
}
