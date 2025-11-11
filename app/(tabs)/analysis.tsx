import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";

export default function AnalysisScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const styles = createStyles(isDarkMode);

  return (
    <View style={styles.container}>
      {/* Título */}
      <View style={styles.textContainer}>
        <Text style={styles.titleTxt}>Análisis de tu semana</Text>
        <Text style={styles.subTxt}>
          Aquí podrás ver como ha sido tu recorrido durante esta semana
        </Text>
      </View>

      {/* Tarjetas */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.textCard}>Promedio de velocidad semanal</Text>
          <Text style={styles.infoCard}>40km/h</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.textCard}>Kilómetros recorridos</Text>
          <Text style={styles.infoCard}>40km</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.textCard}>Cantidad de excesos de velocidad</Text>
          <Text style={styles.infoCard}>1 veces</Text>
        </View>
      </View>
    </View>
  );
}

function createStyles(isDarkMode: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#000" : "#fff",
      alignItems: "center",
      paddingTop: 50,
    },
    textContainer: {
      alignItems: "center",
      paddingHorizontal: 30,
      marginBottom: 30,
    },
    titleTxt: {
      color: "#2BAEEF",
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 8,
    },
    subTxt: {
      color: isDarkMode ? "#6C6C6C" : "#666",
      fontSize: 17,
      textAlign: "center",
    },
    cardContainer: {
      width: "100%",
      alignItems: "center",
      gap: 20,
    },
    card: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#2BAEEF",
      borderRadius: 10,
      paddingVertical: 20,
      paddingHorizontal: 20,
      width: "85%",
      height: '20%',
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 3,
    },
    textCard: {
      color: "#fff",
      fontSize: 17,
      flexShrink: 1,
    },
    infoCard: {
      color: "#fff",
      fontSize: 23,
      fontWeight: "bold",
    },
  });
}
