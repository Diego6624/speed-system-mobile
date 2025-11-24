import React from "react";
import {
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

  // Datos estáticos (luego los puedes reemplazar por datos del backend)
  const data = [
    { velocidadPromedio: "65", kilometrosRecorridos: "120", excesosVelocidad: "3 veces" },
  ];

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
      {data.map(({ velocidadPromedio, kilometrosRecorridos, excesosVelocidad }, i) => (
        <View key={i} style={styles.cardsGrid}>
          {/* Bloque 1 */}
          <View style={styles.circleBlock}>
            <View style={styles.circle}>
              <Text style={styles.circleValue}>{velocidadPromedio} km/h</Text>
            </View>
            <Text style={styles.circleLabel}>Promedio de velocidad semanal</Text>
            <View style={styles.separator} />
          </View>

          {/* Bloque 2 */}
          <View style={styles.circleBlock}>
            <View style={styles.circle}>
              <Text style={styles.circleValue}>{kilometrosRecorridos} km</Text>
            </View>
            <Text style={styles.circleLabel}>Kilómetros recorridos</Text>
            <View style={styles.separator} />
          </View>

          {/* Bloque 3 (sin separador al final) */}
          <View style={styles.circleBlock}>
            <View style={styles.circle}>
              <Text style={styles.circleValue}>{excesosVelocidad}</Text>
            </View>
            <Text style={styles.circleLabel}>Excesos de velocidad</Text>
          </View>
        </View>
      ))}
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
      color: isDarkMode ? "#d6d6d6" : "#6C6C6C", // corregido el hex
      fontSize: 16.5,
      textAlign: "center",
      lineHeight: 22,
    },

    // Grid vertical con separación uniforme
    cardsGrid: {
      width: "100%",
      alignItems: "center",
      gap: 30,
    },

    // Bloque: círculo + etiqueta (texto afuera)
    circleBlock: {
      alignItems: "center",
      gap: 15,
      width: "100%",
    },

    // Círculo (paleta actual que usaste)
    circle: {
      width: 170,
      aspectRatio: 1,
      borderRadius: 85,
      backgroundColor: "#24372C",
      borderColor: "#66E4F5",
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#66E4F5",
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 3,
      paddingHorizontal: 12,
    },

    // Valor dentro del círculo con pseudo-borde (sombra)
    circleValue: {
      color: "#67E8F9",
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      textShadowColor: "#315A55",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 3,
    },

    // Etiqueta afuera del círculo
    circleLabel: {
      color: isDarkMode ? "#FFFFFF" : "#2BAEEF",
      fontSize: 17,
      textAlign: "center",
      lineHeight: 20,
      maxWidth: 220,
      fontWeight: "bold",
    },

    // Línea separadora (no en el último bloque)
    separator: {
      width: "70%",
      height: 1,
      backgroundColor: isDarkMode ? "#ffffffff" : "#000000ff",
      opacity: 0.4,
      marginTop: 12,
    },
  });
}
