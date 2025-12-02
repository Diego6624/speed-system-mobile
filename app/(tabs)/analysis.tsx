import { useAuth } from "@/context/AuthContext";
import { getWeeklyStats } from "@/services/trackingAnalysisService"; // ajusta la ruta según tu proyecto
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
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!token || !token.includes(".")) {
          setErrorMsg("Tu sesión ha expirado, vuelve a iniciar sesión.");
          setLoading(false);
          return;
        }

        const data = await getWeeklyStats(token);

        if (!data || data.totalKm === 0) {
          setErrorMsg("No tienes recorridos registrados esta semana.");
        } else {
          setStats(data);
        }
      } catch (err) {
        console.error("Error cargando análisis:", err);
        setErrorMsg("No se pudo cargar el análisis. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  return errorMsg ? (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Ups...</Text>
      <Text style={styles.errorMessage}>{errorMsg}</Text>
      <View style={styles.retryButton} onTouchEnd={() => {
        setErrorMsg(null);
        setLoading(true);
        setStats(null);
      }}>
        <Text style={styles.retryText}>Reintentar</Text>
      </View>
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Título */}
      <View style={styles.textContainer}>
        <Text style={styles.titleTxt}>Análisis de tu semana</Text>
        <Text style={styles.subTxt}>
          Aquí podrás ver cómo ha sido tu recorrido durante esta semana
        </Text>
      </View>

      {/* Círculos + etiquetas */}
      <View style={styles.cardsGrid}>
        {/* Promedio de velocidad */}
        <View style={styles.circleBlock}>
          <View style={styles.circle}>
            {loading ? (
              <ActivityIndicator size="large" color={isDarkMode ? "#67E8F9" : "#2BAEEF"} />
            ) : (
              <Text style={styles.circleValue}>{stats?.velocidadProm} km/h</Text>
            )}
          </View>
          <Text style={styles.circleLabel}>Promedio de velocidad semanal</Text>
          <View style={styles.separator} />
        </View>

        {/* Kilómetros recorridos */}
        <View style={styles.circleBlock}>
          <View style={styles.circle}>
            {loading ? (
              <ActivityIndicator size="large" color={isDarkMode ? "#67E8F9" : "#2BAEEF"} />
            ) : (
              <Text style={styles.circleValue}>{stats?.totalKm} km</Text>
            )}
          </View>
          <Text style={styles.circleLabel}>Kilómetros recorridos</Text>
          <View style={styles.separator} />
        </View>

        {/* Excesos de velocidad */}
        <View style={styles.circleBlock}>
          <View style={styles.circle}>
            {loading ? (
              <ActivityIndicator size="large" color={isDarkMode ? "#67E8F9" : "#2BAEEF"} />
            ) : (
              <Text style={styles.circleValue}>{stats?.excesosVelocidad} veces</Text>
            )}
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
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 40,
      backgroundColor: isDarkMode ? "#000" : "#fff",
    },
    errorTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: isDarkMode ? "#FF6B6B" : "#D00000",
      marginBottom: 12,
    },
    errorMessage: {
      fontSize: 17,
      textAlign: "center",
      color: isDarkMode ? "#fff" : "#333",
      lineHeight: 24,
    },
    retryButton: {
      marginTop: 24,
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: isDarkMode ? "#FF6B6B" : "#D00000",
      borderRadius: 8,
    },

    retryText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
  });
}
