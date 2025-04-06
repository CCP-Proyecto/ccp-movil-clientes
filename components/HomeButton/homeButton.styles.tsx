import { StyleSheet } from "react-native";
import { colors } from "@/theme";

export const styles = StyleSheet.create({
  button: {
    width: "90%",
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
    alignItems: "center",
    marginVertical: 10,
  },
  text: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: colors.secondary,
  },
});
