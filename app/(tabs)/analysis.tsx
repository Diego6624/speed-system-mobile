import { getWeeklyStats } from "@/services/tripService";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

export default function AnalysisScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const styles = createStyles(isDarkMode);

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getWeeklyStats();
        setStats(data);
      } catch (e) {
        console.log("Error obteniendo stats:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.scrollContainer}>
        <ActivityIndicator size="large" color={isDarkMode ? "#67E8F9" : "#2BAEEF"} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Título */}
      <View style={styles.textContainer}>
        <Text style={styles.titleTxt}>Análisis de tu semana</Text>
        <Text style={styles.subTxt}>
          Aquí podrás ver como ha sido tu recorrido durante esta semana
        </Text>
      </View>

      {/* Círculos + etiquetas (texto afuera) con separadores */}
      <View style={styles.cardsGrid}>
        {/* Bloque 1 */}
        <View style={styles.circleBlock}>
          <View style={styles.circle}>
            <Text style={styles.circleValue}>{stats?.velocidadPromSemanal ?? 0} km/h</Text>
          </View>
          <Text style={styles.circleLabel}>Promedio de velocidad semanal</Text>
          <View style={styles.separator} />
        </View>

        {/* Bloque 2 */}
        <View style={styles.circleBlock}>
          <View style={styles.circle}>
            <Text style={styles.circleValue}>{stats?.kilometrosRecorridos ?? 0} km</Text>
          </View>
          <Text style={styles.circleLabel}>Kilómetros recorridos</Text>
          <View style={styles.separator} />
        </View>

        {/* Bloque 3 (sin separador al final) */}
        <View style={styles.circleBlock}>
          <View style={styles.circle}>
            <Text style={styles.circleValue}>{stats?.excesosVelocidad ?? 0} veces</Text>
          </View>
          <Text style={styles.circleLabel}>Excesos de velocidad</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(isDarkMode: boolean) {
  return StyleSheet.create({
    scrollContainer: {
      paddingTop: 50,
      paddingBottom: 90,
      paddingHorizontal: 24,
      backgroundColor: isDarkMode ? "#000" : "#fff",
      alignItems: "center",
    },
    textContainer: {
      alignItems: "center",
      marginBottom: 28,
      paddingHorizontal: 16,
    },
    titleTxt: {
      color: "#2BAEEF",
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 8,
    },
    subTxt: {
      color: isDarkMode ? "#d6d6d6" : "#6C6C6C",
      fontSize: 16.5,
      textAlign: "center",
      lineHeight: 22,
    },
    cardsGrid: {
      width: "100%",
      alignItems: "center",
      gap: 30,
    },
    circleBlock: {
      alignItems: "center",
      gap: 15,
      width: "100%",
    },
    circle: {
      width: 170,
      aspectRatio: 1,
      borderRadius: 85,
      backgroundColor: isDarkMode ? "#24372C" : "#fff",
      borderColor: isDarkMode ? "#66E4F5" : "#2BAEEF",
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: isDarkMode ? "#66E4F5" : "#2BAEEF",
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 3,
      paddingHorizontal: 12,
    },
    circleValue: {
      color: isDarkMode ? "#67E8F9" : "#494949",
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      textShadowColor: isDarkMode ? "#315A55" : "#fff",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 3,
    },
    circleLabel: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
      fontSize: 17,
      textAlign: "center",
      lineHeight: 20,
      maxWidth: 220,
      fontWeight: "bold",
    },
    separator: {
      width: "70%",
      height: 1,
      backgroundColor: isDarkMode ? "#fff" : "#000",
      opacity: 0.4,
      marginTop: 12,
    },
  });
}
