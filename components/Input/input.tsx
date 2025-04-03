import React from "react";
import { View, TextInput, Text, KeyboardTypeOptions } from "react-native";
import { styles } from "./input.styles";

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

export const Input = ({
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry = false,
  keyboardType = "default",
}: InputProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[styles.input, error && styles.inputError]}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};
