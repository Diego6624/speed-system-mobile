import * as Location from "expo-location";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function IndexScreen() {
  const [location, setLocation] = useState<any>(null);
  const [speed, setSpeed] = useState(0);
  const [limit, setLimit] = useState(40);
  const [lastAlertTime, setLastAlertTime] = useState(0);
  const [lastSpeedVoiceTime, setLastSpeedVoiceTime] = useState(0);
  const [lastSpokenSpeed, setLastSpokenSpeed] = useState(0);

  const isSpeaking = useRef(false);

  // 👉 función controlada para hablar con prioridad
  const speak = async (text: string, priority = false) => {
    if (isSpeaking.current && !priority) return; // ignora si ya está hablando
    if (priority) Speech.stop(); // si es urgente, interrumpe y habla

    isSpeaking.current = true;
    Speech.speak(text, {
      language: "es-ES",
      rate: 0.95,
      onDone: () => {
        isSpeaking.current = false;
      },
    });
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Activa la ubicación para continuar");
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1500, // Intervalo de actualización de 1.5 s
          distanceInterval: 4, // Actualiza cada 4 m
        },
        (loc) => {
          const speedMs = loc.coords.speed ?? 0;
          setLocation(loc.coords);

          let speedKmH = speedMs * 3.6;
          if (speedKmH < 0 || speedKmH > 150) speedKmH = 0;
          setSpeed(Number(speedKmH.toFixed(1)));

          const now = Date.now();
          const tolerance = 4; //Tolerancia de 1 km/h (para test: dif -> 0.5)
          const cooldown = 15000; // cooldown de 15 s (para test: 30000)

          // 🚫 Ignorar ruido del GPS
          if (speedKmH < 1.5) return;

          // 🔊 Aviso de velocidad cada 15 s o cambio notable y dif de 1 (para test: dif -> 0.5 | lasSpeedVoiceTime -> 10000)
          if (now - lastSpeedVoiceTime > 15000 && !isSpeaking.current) {
            speak(`Tu velocidad actual es de ${speedKmH.toFixed(0)} kilómetros por hora.`);
            setLastSpokenSpeed(speedKmH);
            setLastSpeedVoiceTime(now);
          }

          // ⚠️ Aviso de exceso de velocidad
          if (speedKmH > limit + tolerance && now - lastAlertTime > cooldown) {
            setLastAlertTime(now);

            speak(`Atención. Has superado el límite de velocidad de ${limit} kilómetros por hora.`, true);

            setTimeout(() => {
              Alert.alert("⚠️ Exceso de velocidad", `Tu velocidad actual es ${speedKmH.toFixed(1)} km/h`);
            }, 2500);
          }
        }
      );
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        followsUserLocation
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Tu ubicación"
          description={`Velocidad: ${speed} km/h`}
        />
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.title}>Contador de velocidad</Text>
        <Text style={styles.speed}>{speed} km/h</Text>
        <Text style={styles.limit}>Límite: {limit} km/h</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 43, backgroundColor: "#181818ff" },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  infoBox: {
    position: "absolute",
    top: 56,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "bold" },
  speed: { fontSize: 40, color: "red", fontWeight: "bold" },
  limit: { fontSize: 18, color: "gray" },
});
