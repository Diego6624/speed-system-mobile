import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";

export default function HistoryScreen() {
    const theme = useColorScheme();

    const colors = theme === "dark"
        ? {
            bg: "#000",
            text: "#fff",
            cardBg: "#1a1a1a",
            cardText: "#e0e0e0",
            icon: "#e0e0e0", // 👈 iconos en modo oscuro
            accent: "#1e90ff",
            fecha: "#aaa",
        }
        : {
            bg: "#f5f5f5",
            text: "#333",
            cardBg: "#4da6ff",
            cardText: "#fff",
            icon: "#fff", // 👈 iconos en modo claro
            accent: "#007bff",
            fecha: "#e0e0e0",
        };

    const viajes = [
        { id: 1, fecha: "10/11/25", recorrido: "10 km", tiempo: "4 h", maxima: "30 km/h", promedio: "15 km/h" },
        { id: 2, fecha: "13/11/25", recorrido: "12 km", tiempo: "3.5 h", maxima: "28 km/h", promedio: "14 km/h" },
        { id: 3, fecha: "15/11/25", recorrido: "15 km", tiempo: "5 h", maxima: "32 km/h", promedio: "16 km/h" },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
            {viajes.map((viaje) => (
                <View key={viaje.id} style={[styles.card, { backgroundColor: colors.cardBg }]}>
                    <Text style={[styles.title, { color: colors.cardText }]}>Viaje {viaje.id}</Text>
                    <Text style={[styles.fecha, { color: colors.fecha }]}>Fecha: {viaje.fecha}</Text>

                    <View style={styles.row}>
                        <View style={styles.item}>
                            <Ionicons name="map-outline" size={20} color={colors.icon} />
                            <Text style={[styles.text, { color: colors.cardText }]}>Recorrido: {viaje.recorrido}</Text>
                        </View>
                        <View style={styles.item}>
                            <Ionicons name="speedometer-outline" size={20} color={colors.icon} />
                            <Text style={[styles.text, { color: colors.cardText }]}>Máxima: {viaje.maxima}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.item}>
                            <Ionicons name="pulse-outline" size={20} color={colors.icon} />
                            <Text style={[styles.text, { color: colors.cardText }]}>Promedio: {viaje.promedio}</Text>
                        </View>
                        <View style={styles.item}>
                            <Ionicons name="time-outline" size={20} color={colors.icon} />
                            <Text style={[styles.text, { color: colors.cardText }]}>Tiempo: {viaje.tiempo}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingVertical: 20, paddingHorizontal: 15, paddingTop: 50, },
    card: {
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,

    },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
    fecha: { fontStyle: "italic", marginBottom: 10 },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        width: "100%",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    text: { fontSize: 16 },
});
