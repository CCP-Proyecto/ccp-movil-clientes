import { StyleSheet } from "react-native";
import { colors } from "@/theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 100,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  button: {
    padding: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.secondary,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    minWidth: 30,
    textAlign: "center",
  },
  input: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    minWidth: 30,
    maxWidth: 40,
    textAlign: "center",
    padding: 0,
  },
});
