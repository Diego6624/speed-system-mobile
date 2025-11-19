import { useAuth } from "@/hooks/useAuth";
import {
  enviarTracking,
  finalizarRecorrido,
  iniciarRecorrido,
} from "@/services/api";
import { obtenerLimiteVelocidad } from "@/services/speedLimit";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function IndexScreen() {
  const [location, setLocation] = useState<any>(null);
  const [speed, setSpeed] = useState(0);
  const [limit, setLimit] = useState(40);

  const recorridoId = useRef<number | null>(null);
  const appState = useRef(AppState.currentState);

  const lastAlertTime = useRef(0);
  const lastSpeedVoiceTime = useRef(0);
  const isSpeaking = useRef(false);
  const lastAnnouncedLimit = useRef<number | null>(null);
  const { user } = useAuth();
  const USER_ID = user?.id;

  // -----------------------------
  // Voz (siempre activa)
  // -----------------------------
  const LAST_PRIORITY = useRef<0 | 1 | 2>(0);
  // 2 = alerta, 1 = cambio limite, 0 = velocidad normal

  const speak = (text: string, priority: 0 | 1 | 2 = 0) => {
    // No interrumpir si algo más importante está hablando
    if (priority < LAST_PRIORITY.current) return;

    // Si prioridad ALTA, interrumpe todo
    if (priority === 2) {
      Speech.stop();
    }

    LAST_PRIORITY.current = priority;
    isSpeaking.current = true;

    Speech.speak(text, {
      language: "es-ES",
      rate: 0.95,
      onDone: () => {
        isSpeaking.current = false;
        LAST_PRIORITY.current = 0; // vuelve a normal
      },
    });
  };
  
  // -----------------------------
  // Backend: Iniciar / Finalizar recorrido
  // -----------------------------
  const iniciarRecorridoBackend = async () => {
    try {
      const data = await iniciarRecorrido(USER_ID);
      recorridoId.current = data.id;
    } catch (e) {
      console.log("Error al iniciar recorrido:", e);
    }
  };

  const finalizarRecorridoBackend = async () => {
    if (!recorridoId.current) return;
    try {
      await finalizarRecorrido(recorridoId.current);
    } catch (e) {
      console.log("Error finalizando recorrido:", e);
    }
  };

  // Detectar cierre de app
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (next) => {
      if (appState.current.match(/active/) && next === "background") {
        await finalizarRecorridoBackend();
      }
      appState.current = next;
    });

    return () => sub.remove();
  }, []);

  // -----------------------------
  // GPS + Tracking + OSM
  // -----------------------------
  useEffect(() => {

    (async () => {
      await iniciarRecorridoBackend();

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert("Permiso denegado", "Activa la ubicación para continuar");
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1500,
          distanceInterval: 4,
        },
        async (loc) => {
          if (!loc?.coords) return;

          const speedMs = loc.coords.speed ?? 0;
          const speedKmH = Math.max(0, Math.min(speedMs * 3.6, 150));

          setSpeed(Number(speedKmH.toFixed(1)));
          setLocation(loc.coords);

          // 🚀 Llamar a tu API de OSM
          const nuevoLimite = await obtenerLimiteVelocidad(
            loc.coords.latitude,
            loc.coords.longitude
          );

          // Limite de velocidad cambiado
          if (nuevoLimite !== null) {
            if (lastAnnouncedLimit.current !== nuevoLimite) {
              console.log("🔥 Cambio REAL de límite detectado:", nuevoLimite);

              lastAnnouncedLimit.current = nuevoLimite; // guardamos el último límite real
              setLimit(nuevoLimite);

              // Voz (prioridad media)
              speak(`Nuevo límite de velocidad: ${nuevoLimite} kilómetros por hora.`, 1);
            }
          }

          // Enviar tracking
          if (recorridoId.current) {
            try {
              await enviarTracking(
                recorridoId.current,
                loc.coords.latitude,
                loc.coords.longitude,
                speedKmH
              );
            } catch (e) {
              console.log("Error enviando tracking:", e);
            }
          }

          const now = Date.now();

          // Hablar velocidad cada 20s
          if (speedKmH > 2 && now - lastSpeedVoiceTime.current > 20000) {
            speak(
              `Tu velocidad actual es ${speedKmH.toFixed(0)} kilómetros por hora.`,
              0 // prioridad baja
            );
            lastSpeedVoiceTime.current = now;
          }

          // Alertar exceso de velocidad
          if (speedKmH > limit + 3 && now - lastAlertTime.current > 8000) {
            lastAlertTime.current = now;

            speak(
              `Atención. Superas el límite de ${limit} kilómetros por hora.`,
              2 // prioridad máxima
            );

            setTimeout(() => {
              Alert.alert(
                "⚠️ Exceso de velocidad",
                `Velocidad actual: ${speedKmH.toFixed(1)} km/h`
              );
            }, 300);
          }
        }
      );
    })();

    return () => {
      void finalizarRecorridoBackend();
    };
  }, []);

  // -----------------------------
  // UI
  // -----------------------------
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
        <Marker coordinate={location} title="Tu ubicación" />
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.title}>Velocidad actual</Text>
        <Text style={styles.speed}>{speed} km/h</Text>
        <Text style={styles.limit}>Límite: {limit} km/h</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 130, justifyContent: "center", alignItems: "center" },
  map: { width: Dimensions.get("window").width, height: Dimensions.get("window").height },
  infoBox: {
    position: "absolute",
    top: 56,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold" },
  speed: { fontSize: 42, fontWeight: "bold", color: "red" },
  limit: { fontSize: 18, color: "gray" },
});
