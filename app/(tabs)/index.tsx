import * as Location from "expo-location";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function IndexScreen() {
  const [location, setLocation] = useState<any>(null);
  const [speed, setSpeed] = useState(0);
  const [limit, setLimit] = useState(10); // límite de velocidad
  const [hasAlerted, setHasAlerted] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState(0);
  const [lastSpokenSpeed, setLastSpokenSpeed] = useState(0);
  const [lastSpeedVoiceTime, setLastSpeedVoiceTime] = useState(0);

  const isSpeaking = useRef(false);

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
          timeInterval: 1000,
          distanceInterval: 0.5,
        },
        (loc) => {
          const speedMs = loc.coords.speed ?? 0;
          setLocation(loc.coords);

          let speedKmH = speedMs * 3.6;
          if (speedKmH < 0 || speedKmH > 150) speedKmH = 0;
          setSpeed(Number(speedKmH.toFixed(1)));

          const now = Date.now();
          const tolerance = 1;
          const diff = Math.abs(speedKmH - lastSpokenSpeed);

          // 🚫 Si la velocidad es muy baja, ignora (ruido del GPS)
          if (speedKmH < 1.5) return;

          // 🔊 --- Aviso de velocidad actual ---
          if (
            diff >= 1 && // solo si cambia ≥5 km/h
            now - lastSpeedVoiceTime > 8000 && // cada 8 s máx
            !isSpeaking.current
          ) {
            isSpeaking.current = true;
            Speech.stop();
            Speech.speak(
              `Tu velocidad actual es de ${speedKmH.toFixed(0)} kilómetros por hora.`,
              {
                language: "es-ES",
                rate: 0.95,
              }
            );
            setTimeout(() => (isSpeaking.current = false), 15000); // evitar que hable más de 15 s
            setLastSpokenSpeed(speedKmH);
            setLastSpeedVoiceTime(now);
          }

          // ⚠️ --- Aviso de exceso de velocidad ---
          if (
            speedKmH > limit + tolerance &&
            !hasAlerted &&
            now - lastAlertTime > 15000 // cada 15 s máx
          ) {
            setHasAlerted(true);
            setLastAlertTime(now);

            if (!isSpeaking.current) {
              isSpeaking.current = true;
              Speech.stop();
              Speech.speak(
                `Atención. Has superado el límite de velocidad de ${limit} kilómetros por hora.`,
                { language: "es-ES", rate: 0.95 }
              );
              setTimeout(() => (isSpeaking.current = false), 4000);
            }

            setTimeout(() => {
              Alert.alert(
                "⚠️ Exceso de velocidad",
                `Tu velocidad actual es ${speedKmH.toFixed(1)} km/h`
              );
            }, 800);
          }

          // 🔄 Reset alerta si baja de velocidad
          setTimeout(() => {
            if (speedKmH < limit - tolerance && hasAlerted) {
              setHasAlerted(false);
            }
          }, 10000); // después de 10 s

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
