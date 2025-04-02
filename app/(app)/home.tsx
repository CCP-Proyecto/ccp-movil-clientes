// TODO: Crear la pantalla principal para cuando el usuario inicia sesión o está autenticado
// *Por ahora dejo este código básico para probar

import { View, Text } from "react-native";
import { authClient } from "@/services/auth/auth-client";
import { Button } from "@/components";

export default function Home() {
  const handleLogout = () => {
    authClient.signOut();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Pantalla Home (Autenticado)</Text>
      <Button
        onPress={handleLogout}
        title="Cerrar sesión"
      />
    </View>
  );
}
