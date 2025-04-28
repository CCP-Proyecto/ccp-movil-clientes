import React, { useState, useEffect, useMemo } from "react";
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
  price: number;
  amount?: number;
  storageCondition?: string;
  manufacturerId?: string;
}

// Datos mock
const productsMock: Product[] = [
  { id: 1, name: "Azúcar", price: 2500, description: "Bolsa x 500g" },
  { id: 2, name: "Sal", price: 1800, description: "Bolsa x 1kg" },
  { id: 3, name: "Café", price: 12000, description: "Premium x 500g" },
  { id: 4, name: "Chocolate", price: 8500, description: "Tableta x 250g" },
  { id: 5, name: "Agua en botella", price: 2200, description: "600ml" },
  { id: 6, name: "Jugo en caja", price: 3500, description: "1L" },
  { id: 7, name: "Vino", price: 35000, description: "Botella 750ml" },
  {
    id: 8,
    name: "Galletas",
    price: 4200,
    description: "Paquete x 12 unidades",
  },
];

export default function CreateOrder() {
  const [products, setProducts] = useState<Product[]>(productsMock);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [wasOrderSent, setWasOrderSent] = useState(false);

  const totalOrderValue = useMemo(() => {
    return products.reduce((total, product) => {
      const quantity = quantities[product.id] || 0;
      return total + product.price * quantity;
    }, 0);
  }, [products, quantities]);

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
        const validatedProducts = data.map((product) => ({
          ...product,
          price: product.price || 0,
        }));
        setProducts(validatedProducts);
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
      const customerId = "";

      const orderData = {
        customerId: customerId,
        products: selectedProducts.map((product) => ({
          productId: product.id,
          quantity: quantities[product.id],
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
          data: {
            id: Math.floor(Math.random() * 10000),
            status: "created",
            total: totalOrderValue,
          },
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
          ? `Pedido por $${totalOrderValue.toLocaleString()} creado correctamente`
          : `Tu pedido por $${totalOrderValue.toLocaleString()} ha sido enviado correctamente`,
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

  // Función para formatear precios en formato de moneda colombiana
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString("es-CO")}`;
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
            {products.map((product) => {
              const quantity = quantities[product.id] || 0;
              const subtotal = product.price * quantity;

              return (
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
                    <Text style={styles.productPrice}>
                      {formatCurrency(product.price)}
                    </Text>
                    {quantity > 0 && (
                      <Text style={styles.subtotalText}>
                        Subtotal: {formatCurrency(subtotal)}
                      </Text>
                    )}
                  </View>
                  <NumberPicker
                    value={quantity}
                    onIncrement={() => handleIncrement(product.id)}
                    onDecrement={() => handleDecrement(product.id)}
                    onChange={(value) => handleValueChange(product.id, value)}
                    min={0}
                    max={999}
                  />
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Total del pedido */}
        {!loadingProducts && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total del pedido:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(totalOrderValue)}
            </Text>
          </View>
        )}

        <Button
          title={isLoading ? "Enviando..." : "Realizar pedido"}
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={
            wasOrderSent ||
            isLoading ||
            loadingProducts ||
            totalOrderValue === 0
          }
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
  subtotalText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 13,
    color: colors.secondary,
    marginTop: 4,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.primary,
    marginTop: 10,
  },
  totalLabel: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 16,
    color: colors.black,
  },
  totalValue: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 18,
    color: colors.primary,
  },
  submitButton: {
    marginTop: 20,
    alignSelf: "center",
    width: "100%",
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
    alignSelf: "center",
  },
});
