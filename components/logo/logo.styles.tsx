import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "90%",
  },
  logo: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 48,
    textAlign: "center",
    color: colors.primary,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  subtitle: {
    fontFamily: "Comfortaa-SemiBold",
    textAlign: "center",
    color: colors.secondary,
    fontSize: 12,
    marginHorizontal: 10,
  },
  line: {
    flex: 1,
    height: 4,
    backgroundColor: colors.secondary,
    borderRadius: 5,
  },
});
