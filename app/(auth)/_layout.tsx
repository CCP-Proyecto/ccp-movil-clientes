import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login-screen" />
      {/* Añade aquí otras pantallas de autenticación que tengas */}
    </Stack>
  );
}
