import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { getMyTrips } from "@/services/trackingAnalysisService";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function HistoryModel() {
  const [trips, setTrips] = useState<any[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const { t } = useLanguage();
  const { darkMode } = useTheme();
  const styles = createStyles(darkMode);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getMyTrips();

        // 👇 Tomamos los últimos 4 viajes más recientes
        const recentTrips = data
          .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
          .slice(0, 4);

        setTrips(recentTrips);
      } catch (err) {
        console.error("Error cargando historial:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={darkMode ? "#67E8F9" : "#2BAEEF"} />
        <Text style={styles.loadingText}>{t("cargandoHistorial")}</Text>
      </View>
    );
  }

  if (trips.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>{t("sinRecorridos")}</Text>
        <Text style={styles.emptySubtitle}>{t("mensajeSinRecorridos")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header simple */}
      <View style={styles.headerBox}>
        <Text style={styles.header}>{t("historial")}</Text>
        <Text style={styles.subHeader}>{t("detallesViaje")}</Text>
      </View>

      {/* Lista de viajes */}
      <View style={styles.whiteBox}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {trips.map((viaje, index) => (
            <TouchableOpacity key={viaje.id} onPress={() => setSelected(index)}>
              <View style={styles.card}>
                <Text style={styles.title}>{t("viaje")} {index + 1}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal elegante */}
      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelected(null)}>
          <View style={styles.modalBackground}>
            {selected !== null && (
              <View style={styles.specsBox}>
                <Text style={styles.specTitle}>{t("historialModal")} {selected + 1}</Text>
                <View style={styles.specRow}>
                  <Text style={styles.label}>{t("distancia")}:</Text>
                  <Text style={styles.value}>{trips[selected].distanciaKm?.toFixed(2)} km</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.label}>{t("promedio")}:</Text>
                  <Text style={styles.value}>{trips[selected].velocidadProm?.toFixed(1)} km/h</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.label}>{t("maxima")}:</Text>
                  <Text style={styles.value}>{trips[selected].velocidadMax?.toFixed(1)} km/h</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.label}>{t("excesos")}:</Text>
                  <Text style={styles.value}>{trips[selected].excesosVelocidad}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.label}>{t("duracion")}:</Text>
                  <Text style={styles.value}>{trips[selected].duracionMin} min</Text>
                </View>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

function createStyles(isDarkMode: boolean) {
  const accent = "#00bfff";
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#0f172a" : "#fff",
      alignItems: "center",
      paddingTop: 20,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#0f172a" : "#fff",
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: isDarkMode ? "#67E8F9" : accent,
    },
    emptyText: {
      marginTop: 20,
      fontSize: 16,
      color: isDarkMode ? "#fff" : "#555",
      fontStyle: "italic",
    },
    headerBox: {
      width: "100%",
      marginTop: 30,
      marginBottom: 15,
      paddingVertical: 10,
      alignItems: "center",
    },
    header: {
      color: "#2BAEEF",
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 8,
    },
    subHeader: {
      color: isDarkMode ? "#d6d6d6" : "#6C6C6C",
      fontSize: 16.5,
      textAlign: "center",
      lineHeight: 22,
    },
    whiteBox: {
      width: "95%",
      backgroundColor: isDarkMode ? "#1e293b" : "#ffffffff",
      borderRadius: 20,
      padding: 15,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    card: {
      width: "100%",
      height: 100,
      marginTop: 13,
      marginBottom: 13,
      borderRadius: 25,
      backgroundColor: isDarkMode ? "#0f172a" : "#fff",
      borderWidth: 2,
      borderColor: accent,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 22,
      color: accent,
      fontWeight: "bold",
    },
    modalBackground: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    specsBox: {
      width: "85%",
      padding: 25,
      borderRadius: 20,
      backgroundColor: isDarkMode ? "#1e293b" : "#fff",
      elevation: 8,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },
    specTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: accent,
    },
    specRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    label: {
      fontSize: 16,
      color: isDarkMode ? "#ccc" : "#555",
      fontWeight: "600",
    },
    value: {
      fontSize: 16,
      color: accent,
      fontWeight: "bold",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      backgroundColor: isDarkMode ? "#0f172a" : "#fff",
    },
    emptyTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#000",
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      color: isDarkMode ? "#ccc" : "#555",
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 12,
    },
    emptyButton: {
      backgroundColor: "#2BAEEF",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 25,
      marginTop: 10,
    },
    emptyButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
}
