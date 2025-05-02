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
import { authClient, fetchClient } from "@/services";
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

export default function CreateOrder() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [wasOrderSent, setWasOrderSent] = useState(false);

  const customerId = authClient.useSession().data?.user?.userId?.toString();

  console.log(authClient.useSession().data?.user);

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
        console.log("No products found or error fetching products.");
        setProducts([]);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No se pudieron cargar los productos.",
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ocurrió un error al cargar los productos.",
      });
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
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const handleValueChange = (id: number, newValue: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(newValue, 0),
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

    if (!customerId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "No se pudo identificar al cliente. Intenta iniciar sesión de nuevo.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        customerId: customerId,
        products: selectedProducts.map((product) => ({
          productId: product.id,
          quantity: quantities[product.id],
        })),
      };

      console.log("Enviando orden:", JSON.stringify(orderData, null, 2));

      const orderResult = await fetchClient.post("/api/order", orderData);

      if (orderResult.error) {
        throw new Error(
          orderResult.error.message || "Error al procesar tu pedido",
        );
      }

      setWasOrderSent(true);
      Toast.show({
        type: "success",
        text1: "Pedido realizado",
        text2: `Tu pedido por ${formatCurrency(totalOrderValue)} ha sido enviado correctamente`,
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
        ) : products.length === 0 ? (
          <Text style={styles.noProductsText}>
            No hay productos disponibles.
          </Text>
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

        {!loadingProducts && products.length > 0 && (
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
            totalOrderValue === 0 ||
            products.length === 0
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
    marginTop: 20,
    marginBottom: 15,
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
    paddingBottom: 20,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray || "#eee",
  },
  productInfo: {
    flex: 1,
    marginRight: 10,
  },
  productName: {
    fontFamily: "Comfortaa-Bold",
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
  noProductsText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: colors.secondary,
    fontFamily: "Comfortaa-Regular",
  },
});
