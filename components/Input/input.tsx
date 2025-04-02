import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { styles } from "./input.styles";

export const Input = (props: TextInputProps) => {
  return (
    <TextInput
      style={styles.input}
      {...props}
    />
  );
};
