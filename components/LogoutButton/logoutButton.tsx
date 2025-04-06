import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { authClient } from "@/services/auth/auth-client";
import Toast from "react-native-toast-message";
import { colors } from "@/theme/colors";
import { styles } from "./logoutButton.styles";

interface LogoutButtonProps {
  onLogoutSuccess?: () => void;
  iconSize?: number;
  iconColor?: string;
  style?: any;
}

export const LogoutButton = ({
  onLogoutSuccess,
  iconSize = 24,
  iconColor = colors.secondary,
  style,
}: LogoutButtonProps) => {
  const handleLogout = async () => {
    try {
      await authClient.signOut();

      if (onLogoutSuccess) {
        onLogoutSuccess();
        return;
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ocurrió un error al cerrar sesión",
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={[styles.button, style]}
      accessibilityLabel="Cerrar sesión"
    >
      <Ionicons
        name="log-out-outline"
        size={iconSize}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};
