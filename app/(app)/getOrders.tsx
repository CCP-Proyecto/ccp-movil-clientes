import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Logo } from "@/components";
import { t } from "@/i18n";
import { colors } from "@/theme/colors";
import { authClient, fetchClient } from "@/services";
import type { Order } from "@/interfaces";

export default function GetOrdersScreen() {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const customerId = authClient.useSession().data?.user?.userId?.toString();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customerId) return;

      try {
        setLoading(true);
        const { data } = await fetchClient.get(
          `api/order/customer/${customerId}`,
        );
        console.log(data);
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const toggleOrderDetails = (orderId: number) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString("es-CO")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "#28a745";
      case "confirmed":
        return "#28a745";
      case "in_progress":
        return "#ffc107";
      case "pending":
        return "#17a2b8";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "check-circle";
      case "confirmed":
        return "check-circle";
      case "in_progress":
        return "truck-delivery";
      case "pending":
        return "clock-outline";
      case "cancelled":
        return "close-circle";
      default:
        return "information";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return t("orders.status.delivered");
      case "confirmed":
        return t("orders.status.confirmed");
      case "in_progress":
        return t("orders.status.inProcess");
      case "pending":
        return t("orders.status.pending");
      case "cancelled":
        return t("orders.status.cancelled");
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Logo />
          <Text style={styles.title}>{t("orders.screenTitle")}</Text>
          <Text style={styles.subtitle}>{t("common.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Logo />

        <Text style={styles.title}>{t("orders.screenTitle")}</Text>
        <Text style={styles.subtitle}>{t("orders.subTitle")}</Text>

        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="package-variant"
              size={64}
              color={colors.secondary}
            />
            <Text style={styles.emptyText}>{t("orders.noOrders")}</Text>
          </View>
        ) : (
          orders.map((order) => (
            <View
              key={order.id}
              style={styles.orderCard}
            >
              <TouchableOpacity
                style={styles.orderHeader}
                onPress={() => toggleOrderDetails(order.id)}
              >
                <View style={styles.orderHeaderLeft}>
                  <MaterialCommunityIcons
                    name="package-variant-closed"
                    size={24}
                    color={colors.primary}
                    style={styles.orderIcon}
                  />
                  <View>
                    <Text style={styles.orderId}>#{order.id}</Text>
                    <Text style={styles.orderDate}>
                      {formatDate(order.createdAt)}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderHeaderRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(order.status) },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={getStatusIcon(order.status)}
                      size={16}
                      color="white"
                    />
                    <Text style={styles.statusText}>
                      {getStatusText(order.status)}
                    </Text>
                  </View>
                  <Text style={styles.orderTotal}>
                    {formatCurrency(order.total)}
                  </Text>
                </View>
              </TouchableOpacity>

              {expandedOrder === order.id && (
                <View style={styles.orderDetails}>
                  {/* Información del cliente */}
                  <View style={styles.customerSection}>
                    <Text style={styles.detailsTitle}>
                      {t("orders.customer")}
                    </Text>
                    <View style={styles.customerCard}>
                      <View style={styles.customerRow}>
                        <MaterialCommunityIcons
                          name="account"
                          size={18}
                          color={colors.primary}
                          style={styles.infoIcon}
                        />
                        <Text style={styles.customerName}>
                          {order.customer.name}
                        </Text>
                      </View>
                      <View style={styles.customerRow}>
                        <MaterialCommunityIcons
                          name="map-marker"
                          size={18}
                          color={colors.primary}
                          style={styles.infoIcon}
                        />
                        <Text style={styles.customerInfo}>
                          {order.customer.address}
                        </Text>
                      </View>
                      <View style={styles.customerRow}>
                        <MaterialCommunityIcons
                          name="phone"
                          size={18}
                          color={colors.primary}
                          style={styles.infoIcon}
                        />
                        <Text style={styles.customerInfo}>
                          {order.customer.phone}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Productos del pedido */}
                  {order.orderProducts && order.orderProducts.length > 0 && (
                    <View style={styles.productsSection}>
                      <Text style={styles.detailsTitle}>
                        {t("orders.products")}
                      </Text>
                      <View style={styles.productsCard}>
                        {order.orderProducts.map((orderProduct, index) => (
                          <View
                            key={`${orderProduct.productId}-${index}`}
                            style={[
                              styles.productRow,
                              index === order.orderProducts.length - 1 &&
                                styles.lastProductRow,
                            ]}
                          >
                            <View style={styles.productInfo}>
                              <View style={styles.productHeader}>
                                <MaterialCommunityIcons
                                  name="package-variant"
                                  size={16}
                                  color={colors.primary}
                                  style={styles.productIcon}
                                />
                                <Text style={styles.productName}>
                                  {orderProduct.product?.name ||
                                    `Producto #${orderProduct.productId}`}
                                </Text>
                              </View>
                              {orderProduct.product?.description && (
                                <Text style={styles.productDescription}>
                                  {orderProduct.product.description}
                                </Text>
                              )}
                              <View style={styles.productQuantityContainer}>
                                <Text style={styles.productQuantity}>
                                  {t("orders.quantity")}:{" "}
                                  {orderProduct.quantity}
                                </Text>
                                <Text style={styles.productUnitPrice}>
                                  {t("orders.unitPrice")}:{" "}
                                  {formatCurrency(orderProduct.priceAtOrder)}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.productPriceContainer}>
                              <Text style={styles.productPrice}>
                                {formatCurrency(
                                  orderProduct.priceAtOrder *
                                    orderProduct.quantity,
                                )}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotalLabel}>Total:</Text>
                    <Text style={styles.orderTotalValue}>
                      {formatCurrency(order.total)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#000",
    alignSelf: "flex-start",
    marginTop: 20,
    fontFamily: "Comfortaa-Bold",
  },
  subtitle: {
    color: "#4a6c8a",
    marginBottom: 16,
    alignSelf: "flex-start",
    fontFamily: "Comfortaa-Regular",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    fontFamily: "Comfortaa-Regular",
  },
  customerCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 10,
    width: 20,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 16,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  orderHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderIcon: {
    marginRight: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Comfortaa-Bold",
  },
  orderDate: {
    fontSize: 13,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  orderHeaderRight: {
    alignItems: "flex-end",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
    fontFamily: "Comfortaa-Bold",
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    fontFamily: "Comfortaa-Bold",
  },
  orderDetails: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  customerSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  customerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Comfortaa-Bold",
  },
  customerInfo: {
    fontSize: 13,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  detailsTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    color: "#444",
    fontFamily: "Comfortaa-Bold",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  orderTotalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
    fontFamily: "Comfortaa-Bold",
  },
  orderTotalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    fontFamily: "Comfortaa-Bold",
  },
  productsSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productsCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lastProductRow: {
    borderBottomWidth: 0,
  },
  productInfo: {
    flex: 1,
    marginRight: 10,
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  productIcon: {
    marginRight: 6,
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Comfortaa-Bold",
    flex: 1,
  },
  productDescription: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Comfortaa-Light",
    marginBottom: 6,
    lineHeight: 16,
  },
  productQuantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 13,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  productUnitPrice: {
    fontSize: 13,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
  },
  storageCondition: {
    fontSize: 11,
    color: "#999",
    fontFamily: "Comfortaa-Light",
    fontStyle: "italic",
  },
  productPriceContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    fontFamily: "Comfortaa-Bold",
  },
  deliverySection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  deliveryCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  deliveryTextContainer: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Comfortaa-Regular",
    marginBottom: 2,
  },
  deliveryValue: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Comfortaa-Bold",
  },
});
