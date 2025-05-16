import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Logo } from "@/components";
import { t } from "@/i18n";

const estados = [
  {
    estado: "EN BODEGA",
    descripcion: "Paquete en Bodega",
    ciudad: "Bogota",
    fecha: "06/03/2025",
  },
];

export default function EstadoEntregaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Logo />

        <Text style={styles.title}>{t("deliveries.screenTitle")}</Text>
        <Text style={styles.subtitle}>{t("deliveries.subTitle")}</Text>

        <View style={styles.cardContainer}>
          <View style={styles.trackingHeader}>
            <MaterialCommunityIcons
              name="clipboard-text"
              size={24}
              color="#fff"
            />
            <Text style={styles.trackingNumber}>
              {`${t("deliveries.orderNumber")}: R014652567`}
            </Text>
          </View>

          {estados.map((item, index) => (
            <View
              key={index}
              style={styles.estadoSection}
            >
              <View style={styles.estadoHeader}>
                <MaterialCommunityIcons
                  name="truck-delivery-outline"
                  size={24}
                  color="#002f6c"
                />
                <Text style={styles.estado}>{item.estado}</Text>
              </View>
              <View style={styles.estadoDetalle}>
                <Text style={styles.textoFila}>
                  {t("deliveries.orderDetails")}
                </Text>
                <Text style={styles.textoFila}>
                  {t("deliveries.orderCity")}
                </Text>
                <Text style={styles.textoFila}>
                  {t("deliveries.orderDate")}
                </Text>
              </View>
              <View style={styles.estadoDetalle}>
                <Text style={styles.descripcion}>{item.descripcion}</Text>
                <Text style={styles.descripcion}>{item.ciudad}</Text>
                <Text style={styles.descripcion}>{item.fecha}</Text>
              </View>
            </View>
          ))}
        </View>
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
  cardContainer: {
    borderWidth: 2,
    borderColor: "#0080ff",
    borderRadius: 8,
    width: "100%",
    paddingBottom: 16,
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
