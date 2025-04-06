import React from "react";
import { TouchableOpacity, Text } from "react-native";

import { styles } from "./homeButton.styles";

interface HomeButtonProps {
  title: string;
  onPress: () => void;
}

export const HomeButton = ({ title, onPress }: HomeButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
