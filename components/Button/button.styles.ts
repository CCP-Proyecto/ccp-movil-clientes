import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    // Sombra para iOS
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Sombra para Android
    elevation: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "Comfortaa-Bold",
  },
  textButton: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    // Eliminar sombra para la variante text
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  textButtonText: {
    color: colors.secondary,
  },
  disabledButton: {
    backgroundColor: colors.gray,
  },
  disabledButtonText: {
    color: colors.darkGray,
  },
});
