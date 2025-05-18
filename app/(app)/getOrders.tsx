import React, { useState } from "react";
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

const mockedOrders = [
  {
    id: "ORD-2023-001",
    date: "10/05/2025",
    status: `${t("orders.status.delivered")}`,
    total: 120000,
    products: [
      { name: "Café Premium", quantity: 2, price: 25000 },
      { name: "Chocolate Artesanal", quantity: 5, price: 14000 },
    ],
  },
  {
    id: "ORD-2023-002",
    date: "12/05/2025",
    status: `${t("orders.status.inProcess")}`,
    total: 85000,
    products: [{ name: "Galletas Tradicionales", quantity: 10, price: 8500 }],
  },
  {
    id: "ORD-2023-003",
    date: "15/05/2025",
    status: `${t("orders.status.pending")}`,
    total: 230000,
    products: [
      { name: "Café Premium", quantity: 3, price: 25000 },
      { name: "Chocolate Artesanal", quantity: 2, price: 14000 },
      { name: "Galletas Tradicionales", quantity: 15, price: 8500 },
    ],
  },
];

export default function GetOrdersScreen() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString("es-CO")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "entregado":
        return "#28a745";
      case "delivered":
        return "#28a745";
      case "en proceso":
        return "#ffc107";
      case "in process":
        return "#ffc107";
      case "pendiente":
        return "#17a2b8";
      case "pending":
        return "#17a2b8";
      default:
        return "#6c757d";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "entregado":
        return "check-circle";
      case "en proceso":
        return "truck-delivery";
      case "pendiente":
        return "clock-outline";
      default:
        return "information";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Logo />

        <Text style={styles.title}>{t("orders.screenTitle")}</Text>
        <Text style={styles.subtitle}>{t("orders.subTitle")}</Text>

        {mockedOrders.map((order) => (
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
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
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
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
                <Text style={styles.orderTotal}>
                  {formatCurrency(order.total)}
                </Text>
              </View>
            </TouchableOpacity>

            {expandedOrder === order.id && (
              <View style={styles.orderDetails}>
                <Text style={styles.detailsTitle}>{t("orders.products")}</Text>
                {order.products.map((product, index) => (
                  <View
                    key={index}
                    style={styles.productRow}
                  >
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productQuantity}>
                        {t("orders.quantity")} {product.quantity}
                      </Text>
                    </View>
                    <Text style={styles.productPrice}>
                      {formatCurrency(product.price * product.quantity)}
                    </Text>
                  </View>
                ))}
                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotalLabel}>Total:</Text>
                  <Text style={styles.orderTotalValue}>
                    {formatCurrency(order.total)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ))}
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
  detailsTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    color: "#444",
    fontFamily: "Comfortaa-Bold",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Comfortaa-Regular",
  },
  productQuantity: {
    fontSize: 13,
    color: "#666",
    marginTop: 3,
    fontFamily: "Comfortaa-Light",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    fontFamily: "Comfortaa-Bold",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 8,
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
});
