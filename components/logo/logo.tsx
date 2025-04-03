import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { styles } from "./logo.styles";

interface LogoProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export const Logo = ({ containerStyle }: LogoProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.logo}>CCP</Text>
      <View style={styles.subtitleContainer}>
        <View style={styles.line} />
        <Text style={styles.subtitle}>COMPRAS FÁCILES, ENVÍOS RÁPIDOS</Text>
        <View style={styles.line} />
      </View>
    </View>
  );
};
