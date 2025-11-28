import { LinearGradient } from "expo-linear-gradient"; // 👈 necesitas expo-linear-gradient
import React, { useState } from "react";
import {
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

export default function HistoryModel() {
  const data = [
    { speed: 50, distancia: 2.5, tiempo: 0.05, promedio: 50, maximo: 60 },
    { speed: 80, distancia: 4.0, tiempo: 0.05, promedio: 80, maximo: 90 },
    { speed: 100, distancia: 5.0, tiempo: 0.05, promedio: 100, maximo: 110 },
  ];

  const [selected, setSelected] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      {/* Header con gradiente */}
      <LinearGradient colors={["#4ea0f8ff", "#21b7e0ff"]} style={styles.headerBox}>
        <Text style={styles.header}>📜 Historial</Text>
      </LinearGradient>

      {data.map((viaje, index) => (
        <TouchableOpacity key={index} onPress={() => setSelected(index)}>
          <ImageBackground
            source={{ uri: "https://cdn.pixabay.com/photo/2022/06/09/17/18/road-7252981_1280.jpg" }}
            style={styles.card}
          >
            <View style={styles.overlay}>
              <Text style={styles.title}>Viaje {index + 1}</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ))}

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
              <LinearGradient colors={["#4ea0f8ff", "#21b7e0ff"]} style={styles.specsBox}>
                <Text style={styles.specTitle}>🚗 Detalles del viaje {selected + 1}</Text>
                <View style={styles.specRow}>
                  <Text style={styles.label}>Velocidad:</Text>
                  <Text style={styles.value}>{data[selected].speed} km/h</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.label}>Distancia:</Text>
                  <Text style={styles.value}>{data[selected].distancia.toFixed(2)} km</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.label}>Promedio:</Text>
                  <Text style={styles.value}>{data[selected].promedio.toFixed(2)} km/h</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.label}>Máxima:</Text>
                  <Text style={styles.value}>{data[selected].maximo} km/h</Text>
                </View>
              </LinearGradient>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", alignItems: "center" },

  headerBox: {
    width: "100%",
    paddingVertical: 20,
    paddingTop: 50,
    alignItems: "center",
    marginBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },

  card: {
    width: 250,
    height: 150,
    marginBottom: 20,
    borderRadius: 15,
    marginTop: 35,
    marginLeft:20,
    marginRight:20,
    overflow: "hidden",
    elevation: 6,
    borderWidth: 2,
    borderColor: "#4ea0f8ff",
  },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, color: "#fff", fontWeight: "bold" },

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
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  specTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#f0f0f0",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});