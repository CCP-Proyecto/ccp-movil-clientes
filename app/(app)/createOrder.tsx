import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { Logo, Button } from "@/components";
import { NumberPicker } from "@/components";
import { colors } from "@/theme/colors";

const products = [
  { id: 1, name: "Azúcar" },
  { id: 2, name: "Sal" },
  { id: 3, name: "Café" },
  { id: 4, name: "Chocolate" },
  { id: 5, name: "Agua en botella" },
  { id: 6, name: "Jugo en caja" },
  { id: 7, name: "Vino" },
  { id: 8, name: "Galletas" },
];

export default function CreateOrder() {
  const [quantities, setQuantities] = useState(
    products.reduce(
      (acc, product) => {
        acc[product.id] = 0;
        return acc;
      },
      {} as Record<number, number>,
    ),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [wasOrderSent, setWasOrderSent] = useState(false);

  const handleIncrement = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const handleDecrement = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(prev[id] - 1, 0), // Evitar valores negativos
    }));
  };

  const handleValueChange = (id: number, newValue: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const handleSubmit = async () => {
    const selectedProducts = products.filter(
      (product) => quantities[product.id] > 0,
    );

    if (selectedProducts.length === 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes seleccionar al menos un producto",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setWasOrderSent(true);
      Toast.show({
        type: "success",
        text1: "Pedido realizado",
        text2: "Tu pedido ha sido enviado correctamente",
        onHide: () => {
          router.replace("/(app)/home");
        },
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo procesar tu pedido. Inténtalo de nuevo.",
      });
      console.error("Error al enviar pedido:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Creación de pedidos</Text>
        <Text style={styles.subtitle}>Selecciona la cantidad de productos</Text>

        <ScrollView contentContainerStyle={styles.productsContainer}>
          {products.map((product) => (
            <View
              key={product.id}
              style={styles.productRow}
            >
              <Text style={styles.productName}>{product.name}</Text>
              <NumberPicker
                value={quantities[product.id]}
                onIncrement={() => handleIncrement(product.id)}
                onDecrement={() => handleDecrement(product.id)}
                onChange={(value) => handleValueChange(product.id, value)}
                min={0}
                max={999}
              />
            </View>
          ))}
        </ScrollView>

        <Button
          title={isLoading ? "Enviando..." : "Realizar pedido"}
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={wasOrderSent || isLoading}
        />
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 24,
    color: colors.black,
    textAlign: "center",
    marginVertical: 10,
  },
  subtitle: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: colors.secondary,
    textAlign: "center",
    marginBottom: 20,
  },
  productsContainer: {
    paddingVertical: 20,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  productName: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: colors.black,
  },
  submitButton: {
    marginTop: 20,
    alignSelf: "center",
    width: "100%",
  },
  loader: {
    marginTop: 20,
    alignSelf: "center",
  },
});
