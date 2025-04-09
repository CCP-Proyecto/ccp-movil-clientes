import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { fetchClient } from "@/services";
import { Logo, Button } from "@/components";
import { NumberPicker } from "@/components";
import { colors } from "@/theme/colors";

interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
  amount?: number;
  storageCondition?: string;
  manufacturerId?: string;
}

const productsMock: Product[] = [
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
  const [products, setProducts] = useState<Product[]>(productsMock);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [wasOrderSent, setWasOrderSent] = useState(false);

  useEffect(() => {
    setQuantities(
      products.reduce(
        (acc, product) => {
          acc[product.id] = 0;
          return acc;
        },
        {} as Record<number, number>,
      ),
    );
  }, [products]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data, error } = await fetchClient.get("/api/product");
      console.log("Products response:", data, "Error:", error);

      if (data && Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        console.log("Using mock products as fallback");
        setProducts(productsMock);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts(productsMock);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      const orderData = {
        products: selectedProducts.map((product) => ({
          id: product.id,
          name: product.name,
          amount: quantities[product.id],
        })),
      };

      console.log("Enviando orden:", JSON.stringify(orderData, null, 2));

      const usingMockProducts = selectedProducts.every((product) =>
        productsMock.some((mock) => mock.id === product.id),
      );

      let orderResult;

      if (usingMockProducts) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        orderResult = {
          data: { id: Math.floor(Math.random() * 10000), status: "created" },
          error: null,
        };
      } else {
        orderResult = await fetchClient.post("/api/order", orderData);
      }

      if (orderResult.error) {
        throw new Error(
          orderResult.error.message || "Error al procesar tu pedido",
        );
      }

      setWasOrderSent(true);
      Toast.show({
        type: "success",
        text1: "Pedido realizado",
        text2: usingMockProducts
          ? "Pedido creado correctamente"
          : "Tu pedido ha sido enviado correctamente",
        onHide: () => {
          router.replace("/(app)/home");
        },
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.message || "No se pudo procesar tu pedido. Inténtalo de nuevo.",
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

        {loadingProducts ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.productsContainer}>
            {products.map((product) => (
              <View
                key={product.id}
                style={styles.productRow}
              >
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  {product.description && (
                    <Text style={styles.productDescription}>
                      {product.description}
                    </Text>
                  )}
                  {product.price !== undefined && (
                    <Text style={styles.productPrice}>
                      ${product.price.toFixed(2)}
                    </Text>
                  )}
                </View>
                <NumberPicker
                  value={quantities[product.id] || 0}
                  onIncrement={() => handleIncrement(product.id)}
                  onDecrement={() => handleDecrement(product.id)}
                  onChange={(value) => handleValueChange(product.id, value)}
                  min={0}
                  max={999}
                />
              </View>
            ))}
          </ScrollView>
        )}

        <Button
          title={isLoading ? "Enviando..." : "Realizar pedido"}
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={wasOrderSent || isLoading || loadingProducts}
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray || "#eee",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 16,
    color: colors.black,
  },
  productDescription: {
    fontFamily: "Comfortaa-Light",
    fontSize: 12,
    color: colors.secondary,
    marginTop: 2,
  },
  productPrice: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
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
