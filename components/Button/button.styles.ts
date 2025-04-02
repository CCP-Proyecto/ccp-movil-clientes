// src/components/button/button.styles.ts
import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  // Estilos para la variante de texto
  textButton: {
    backgroundColor: "transparent",
    shadowColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  textButtonText: {
    color: colors.secondary,
  },
});
