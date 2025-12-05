import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { getWeeklyStats } from "@/services/trackingAnalysisService";
import { getToken } from "@/utils/secureStore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AnalysisScreen() {
  const { t } = useLanguage();
  const { darkMode } = useTheme();
  const styles = createStyles(darkMode);

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getWeeklyStats();

        if (!data) {
          setErrorMsg(t("errorCargarAnalisis"));
        } else {
          setStats(data);
        }
      } catch (err) {
        console.error("Error cargando análisis:", err);
        setErrorMsg(t("errorAnalisisIntentaMasTarde"));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      console.log("🔐 Token actual en SecureStore:", token);
    })();
  }, []);

  return errorMsg ? (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>{t("ups")}</Text>
      <Text style={styles.errorMessage}>{errorMsg}</Text>
      <View
        style={styles.retryButton}
        onTouchEnd={() => {
          setErrorMsg(null);
          setLoading(true);
          setStats(null);
        }}
      >
        <Text style={styles.retryText}>{t("reintentar")}</Text>
      </View>
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.titleTxt}>{t("analisisSemana")}</Text>
        <Text style={styles.subTxt}>{t("descripcionAnalisisSemana")}</Text>
      </View>

      <View style={styles.cardsGrid}>
        <View style={styles.circleBlock}>
          <View style={styles.circle}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={darkMode ? "#67E8F9" : "#2BAEEF"}
              />
            ) : (
              <Text style={styles.circleValue}>
                {stats && stats.velocidadPromSemanal !== undefined
                  ? stats.velocidadPromSemanal.toFixed(1)
                  : 0}{" "}
                km/h
              </Text>
            )}
          </View>
          <Text style={styles.circleLabel}>{t("promedioVelocidadSemanal")}</Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.circleBlock}>
          <View style={styles.circle}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={darkMode ? "#67E8F9" : "#2BAEEF"}
              />
            ) : (
              <Text style={styles.circleValue}>
                {stats && stats.kilometrosRecorridos !== undefined
                  ? stats.kilometrosRecorridos.toFixed(2)
                  : 0}{" "}
                km
              </Text>
            )}
          </View>
          <Text style={styles.circleLabel}>{t("kilometrosRecorridos")}</Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.circleBlock}>
          <View style={styles.circle}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={darkMode ? "#67E8F9" : "#2BAEEF"}
              />
            ) : (
              <Text style={styles.circleValue}>
                {stats && stats.excesosVelocidad !== undefined
                  ? stats.excesosVelocidad
                  : 0}{" "}
                {t("veces")}
              </Text>
            )}
          </View>
          <Text style={styles.circleLabel}>{t("excesosVelocidad")}</Text>
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
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffffff",
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
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffffff",
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
