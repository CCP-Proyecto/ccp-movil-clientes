import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";

import { authClient } from "@/services/auth/auth-client";

export default function RootLayout() {
  const { isPending, data: session } = authClient.useSession();

  const [fontsLoaded, fontError] = useFonts({
    "Comfortaa-Light": require("../assets/fonts/Comfortaa-Light.ttf"),
    "Comfortaa-Regular": require("../assets/fonts/Comfortaa-Regular.ttf"),
    "Comfortaa-Medium": require("../assets/fonts/Comfortaa-Medium.ttf"),
    "Comfortaa-SemiBold": require("../assets/fonts/Comfortaa-SemiBold.ttf"),
    "Comfortaa-Bold": require("../assets/fonts/Comfortaa-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Ocultar la pantalla de splash cuando las fuentes estén cargadas o haya un error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Devolver null hasta que las fuentes estén cargadas
  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (isPending) {
    return null; // TODO: Hacer un loading
  }

  // Devolver null hasta que las fuentes estén cargadas
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {!session ? (
          // Rutas para usuarios no autenticados
          <Stack.Screen name="(auth)" />
        ) : (
          // Rutas para usuarios autenticados
          <Stack.Screen name="(app)" />
        )}
      </Stack>
      <Toast />
    </>
  );
}
