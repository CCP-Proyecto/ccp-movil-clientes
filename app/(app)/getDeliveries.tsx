import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Logo } from "@/components";
import { t } from "@/i18n";
import { authClient, fetchClient } from "@/services";

interface Delivery {
  id: number;
  estimatedDeliveryDate: string;
  actualDeliveryDate: string | null;
  status: string;
  trackingNumber: string | null;
  notes: string | null;
  address: string;
  createdAt: string;
  updatedAt: string;
  orderId: number;
  order: {
    id: number;
    status: string;
    total: number;
    createdAt: string;
    updatedAt: string;
    customerId: string;
    salespersonId: string | null;
    customer: {
      id: string;
      idType: string;
      name: string;
      address: string;
      phone: string;
      createdAt: string;
      updatedAt: string;
      salespersonId: string | null;
    };
    salesperson: any;
  };
}

export default function EstadoEntregaScreen() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const customerId = authClient.useSession().data?.user?.userId?.toString();

  const fetchDeliveries = useCallback(async () => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await fetchClient.get(`api/delivery`);
      console.log("All deliveries data:", data);

      const customerDeliveries =
        data?.filter(
          (delivery: Delivery) => delivery.order.customerId === customerId,
        ) || [];

      console.log("Customer deliveries:", customerDeliveries);
      setDeliveries(customerDeliveries);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchDeliveries();
  }, [customerId, fetchDeliveries]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "entregado":
        return "ENTREGADO";
      case "in_transit":
      case "en reparto":
        return "EN REPARTO";
      case "pending":
      case "en bodega":
        return "EN BODEGA";
      default:
        return status.toUpperCase();
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "entregado":
        return "Paquete entregado";
      case "in_transit":
      case "en reparto":
        return "Paquete en reparto";
      case "pending":
      case "en bodega":
        return "Paquete en bodega";
      default:
        return "Estado del paquete";
    }
  };

  const getCityFromAddress = (address: string) => {
    const parts = address.split(",");
    if (parts.length > 1) {
      return parts[parts.length - 2].trim();
    }
    return "Bogotá"; // Default
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Logo />
          <Text style={styles.title}>{t("deliveries.screenTitle")}</Text>
          <ActivityIndicator
            size="large"
            color="#0080ff"
            style={{ marginTop: 50 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Logo />

        <Text style={styles.title}>{t("deliveries.screenTitle")}</Text>
        <Text style={styles.subtitle}>{t("deliveries.subTitle")}</Text>

        {!customerId ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="account-alert"
              size={64}
              color="#999"
            />
            <Text style={styles.emptyText}>
              No se pudo identificar al cliente. Intenta iniciar sesión de
              nuevo.
            </Text>
          </View>
        ) : deliveries.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="truck-delivery-outline"
              size={64}
              color="#999"
            />
            <Text style={styles.emptyText}>{t("deliveries.noDeliveries")}</Text>
          </View>
        ) : (
          deliveries.map((delivery) => (
            <View
              key={delivery.id}
              style={styles.cardContainer}
            >
              <View style={styles.trackingHeader}>
                <MaterialCommunityIcons
                  name="clipboard-text"
                  size={24}
                  color="#fff"
                />
                <Text style={styles.trackingNumber}>
                  {`${t("deliveries.orderNumber")}: ${delivery.order.id.toString().padStart(8, "0")}`}
                </Text>
              </View>

              <View style={styles.estadoSection}>
                <View style={styles.estadoHeader}>
                  <MaterialCommunityIcons
                    name="truck-delivery-outline"
                    size={24}
                    color="#002f6c"
                  />
                  <Text style={styles.estado}>
                    {getStatusText(delivery.status)}
                  </Text>
                </View>
                <View style={styles.estadoDetalle}>
                  <Text style={styles.textoFila}>
                    {t("deliveries.deliveryDetails")}
                  </Text>
                  <Text style={styles.textoFila}>
                    {t("deliveries.deliveryCity")}
                  </Text>
                  <Text style={styles.textoFila}>
                    {t("deliveries.deliveryDate")}
                  </Text>
                </View>
                <View style={styles.estadoDetalle}>
                  <Text style={styles.descripcion}>
                    {getStatusDescription(delivery.status)}
                  </Text>
                  <Text style={styles.descripcion}>
                    {getCityFromAddress(delivery.address)}
                  </Text>
                  <Text style={styles.descripcion}>
                    {delivery.actualDeliveryDate
                      ? formatDate(delivery.actualDeliveryDate)
                      : formatDate(delivery.estimatedDeliveryDate)}
                  </Text>
                </View>
              </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    marginTop: 10,
  },
  backIcon: {
    position: "absolute",
    left: 0,
  },
  logo: {
    fontSize: 32,
    fontWeight: "600",
    color: "#4a6c8a",
  },
  subLogo: {
    color: "#4a6c8a",
    fontSize: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#000",
    alignSelf: "flex-start",
    marginTop: 20,
  },
  subtitle: {
    color: "#4a6c8a",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  cardContainer: {
    borderWidth: 2,
    borderColor: "#0080ff",
    borderRadius: 8,
    width: "100%",
    paddingBottom: 16,
    marginBottom: 16,
  },
  trackingHeader: {
    backgroundColor: "#0080ff",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  trackingNumber: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "500",
  },
  estadoSection: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  estadoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  estado: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003d99",
    marginLeft: 10,
  },
  estadoDetalle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  textoFila: {
    fontWeight: "500",
    fontSize: 13,
  },
  descripcion: {
    color: "#333",
    fontSize: 13,
    width: "30%",
  },
});
