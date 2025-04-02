// src/components/button/button.tsx
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "./button.styles";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "contained" | "text";
}

export const Button = ({
  title,
  onPress,
  variant = "contained",
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, variant === "text" && styles.textButton]}
      onPress={onPress}
    >
      <Text
        style={[styles.buttonText, variant === "text" && styles.textButtonText]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
