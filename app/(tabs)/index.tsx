import { useAuth } from "@/context/AuthContext";
import { enviarTracking, finalizarRecorrido, iniciarRecorrido } from "@/services/api";
import { obtenerLimiteVelocidad } from "@/services/speedLimit";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { Alert, AppState, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function IndexScreen() {
  const [location, setLocation] = useState<any>(null);
  const [speed, setSpeed] = useState(0);
  const [limit, setLimit] = useState(40);

  const recorridoId = useRef<number | null>(null);
  const appState = useRef(AppState.currentState);

  // Cooldowns: PRÓXIMO tiempo permitido para cada anuncio
  const nextSpeedVoiceAt = useRef(0);
  const nextAlertVoiceAt = useRef(0);
  const nextLimitVoiceAt = useRef(0);

  // Cooldown global: evita dos voces pegadas en un mismo ciclo/segundo
  const nextVoiceAnyAt = useRef(0);

  // Tracking último límite anunciado y throttle de fetch
  const lastAnnouncedLimit = useRef<number | null>(null);
  const nextLimitFetchAt = useRef(0);

  // Prioridad actual (2 alerta, 1 límite, 0 velocidad)
  const LAST_PRIORITY = useRef<0 | 1 | 2>(0);

  const { user } = useAuth();
  const USER_ID = user?.id;

  const speak = (text: string, priority: 0 | 1 | 2 = 0) => {
    if (priority < LAST_PRIORITY.current) return;
    if (priority === 2) {
      Speech.stop(); // alerta interrumpe todo
    }
    LAST_PRIORITY.current = priority;

    Speech.speak(text, {
      language: "es-ES",
      rate: 0.95,
      onDone: () => {
        LAST_PRIORITY.current = 0; // vuelve a normal al terminar
      },
    });
  };

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

  useEffect(() => {
    const sub = AppState.addEventListener("change", async (next) => {
      if (appState.current.match(/active/) && next === "background") {
        await finalizarRecorridoBackend();
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    (async () => {
      await iniciarRecorridoBackend();

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Activa la ubicación para continuar");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1500,
          distanceInterval: 4,
        },
        async (loc) => {
          const now = Date.now();
          let didSpeak = false;

          if (!loc?.coords) return;

          const speedMs = loc.coords.speed ?? 0;
          const speedKmH = Math.max(0, Math.min(speedMs * 3.6, 150));

          setSpeed(Number(speedKmH.toFixed(1)));
          setLocation(loc.coords);

          // 1) ALERTA (prioridad 2)
          if (!didSpeak && speedKmH > limit + 3 && now >= nextAlertVoiceAt.current && now >= nextVoiceAnyAt.current) {
            speak(`Atención. Superas el límite de ${limit} kilómetros por hora.`, 2);
            nextAlertVoiceAt.current = now + 8000;   // cooldown alerta
            nextVoiceAnyAt.current = now + 1200;     // separación mínima entre voces
            didSpeak = true;

            setTimeout(() => {
              Alert.alert("⚠️ Exceso de velocidad", `Velocidad actual: ${speedKmH.toFixed(1)} km/h`);
            }, 300);
          }

          // 2) FETCH LÍMITE con throttle
          if (now >= nextLimitFetchAt.current) {
            nextLimitFetchAt.current = now + 7000; // cada 7s
            try {
              const nuevoLimite = await obtenerLimiteVelocidad(
                loc.coords.latitude,
                loc.coords.longitude
              );

              // 2.a) ANUNCIO LÍMITE (prioridad 1)
              if (
                !didSpeak &&
                nuevoLimite !== null &&
                lastAnnouncedLimit.current !== nuevoLimite &&
                now >= nextLimitVoiceAt.current &&
                now >= nextVoiceAnyAt.current
              ) {
                lastAnnouncedLimit.current = nuevoLimite;
                setLimit(nuevoLimite);

                speak(`Nuevo límite de velocidad: ${nuevoLimite} kilómetros por hora.`, 1);
                nextLimitVoiceAt.current = now + 10000; // cooldown límite
                nextVoiceAnyAt.current = now + 1200;    // separación mínima entre voces
                didSpeak = true;
              }
            } catch (e) {
              console.log("Error obteniendo límite OSM:", e);
            }
          }

          // 3) VELOCIDAD (prioridad 0)
          // No se dispara si ya habló algo en este ciclo (didSpeak)
          if (
            !didSpeak &&
            speedKmH > 2 &&
            now >= nextSpeedVoiceAt.current &&
            now >= nextVoiceAnyAt.current &&
            LAST_PRIORITY.current < 2 // no hablar si hay alerta activa
          ) {
            speak(`Tu velocidad actual es ${speedKmH.toFixed(0)} kilómetros por hora.`, 0);
            nextSpeedVoiceAt.current = now + 20000; // cooldown velocidad
            nextVoiceAnyAt.current = now + 1200;    // separación mínima entre voces
            didSpeak = true;
          }

          // TRACKING (sin bloquear)
          if (recorridoId.current) {
            enviarTracking(
              recorridoId.current,
              loc.coords.latitude,
              loc.coords.longitude,
              speedKmH
            ).catch((e) => console.log("Error enviando tracking:", e));
          }
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      void finalizarRecorridoBackend();
    };
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
