import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { styles } from "./numberPicker.styles";

interface NumberPickerProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
}

export const NumberPicker = ({
  value,
  onIncrement,
  onDecrement,
  onChange,
  min = 0,
  max = 999,
}: NumberPickerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleTextChange = (text: string) => {
    // Permitir solo números
    if (/^\d*$/.test(text)) {
      setInputValue(text);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);

    let numValue = parseInt(inputValue || "0", 10);

    numValue = Math.max(min, Math.min(max, numValue));

    if (numValue !== value && onChange) {
      onChange(numValue);
    }

    setInputValue(numValue.toString());
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onDecrement}
        style={styles.button}
        accessibilityLabel="Disminuir cantidad"
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          keyboardType="number-pad"
          selectTextOnFocus
          autoFocus
          maxLength={3}
        />
      ) : (
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          accessibilityLabel="Editar cantidad"
        >
          <Text style={styles.value}>{value}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={onIncrement}
        style={styles.button}
        accessibilityLabel="Aumentar cantidad"
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};
