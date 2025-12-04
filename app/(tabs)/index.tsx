import { useAuth } from "@/context/AuthContext";
import { obtenerLimiteVelocidad } from "@/services/speedLimit";
import { enviarTracking, finalizarRecorrido, iniciarRecorrido } from "@/services/trackingService";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function IndexScreen() {
  const [location, setLocation] = useState<any>(null);
  const [speed, setSpeed] = useState(0);
  const [limit, setLimit] = useState(40);
  const [isTracking, setIsTracking] = useState(false);

  const recorridoId = useRef<number | null>(null);
  const isTrackingRef = useRef(false); // 👈 referencia para tracking

  // Cooldowns
  const nextSpeedVoiceAt = useRef(0);
  const nextAlertVoiceAt = useRef(0);
  const nextLimitVoiceAt = useRef(0);
  const lastAnnouncedLimit = useRef<number | null>(null);
  const nextLimitFetchAt = useRef(0);
  const LAST_PRIORITY = useRef<0 | 1 | 2>(0);

  const { user } = useAuth();
  const USER_ID = user?.id;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const styles = createStyles(isDarkMode);

  const speak = (text: string, priority: 0 | 1 | 2 = 0) => {
    if (priority < LAST_PRIORITY.current) return;
    if (priority === 2) Speech.stop();
    LAST_PRIORITY.current = priority;

    Speech.speak(text, {
      language: "es-ES",
      rate: 0.95,
      onDone: () => {
        LAST_PRIORITY.current = 0;
      },
    });
  };

  const startTracking = async () => {
    try {
      const data = await iniciarRecorrido();
      console.log("Respuesta iniciarRecorrido:", data);
      recorridoId.current = data.id;
      isTrackingRef.current = true; // 👈 activa la ref
      setIsTracking(true);
    } catch (e) {
      console.log("Error al iniciar recorrido:", e);
    }
  };

  const stopTracking = async () => {
    if (!recorridoId.current) return;
    try {
      await finalizarRecorrido(recorridoId.current);
      recorridoId.current = null;
      isTrackingRef.current = false; // 👈 desactiva la ref
      setIsTracking(false);
    } catch (e) {
      console.log("Error finalizando recorrido:", e);
    }
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    (async () => {
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
          if (!loc?.coords) return;

          // Siempre: actualizar ubicación y velocidad
          setLocation(loc.coords);
          const speedMs = loc.coords.speed ?? 0;
          const speedKmH = Math.max(0, Math.min(speedMs * 3.6, 150));
          setSpeed(Number(speedKmH.toFixed(1)));

          const now = Date.now();

          // Siempre: calcular límite de velocidad
          if (now >= nextLimitFetchAt.current) {
            nextLimitFetchAt.current = now + 7000;
            try {
              const nuevoLimite = await obtenerLimiteVelocidad(
                loc.coords.latitude,
                loc.coords.longitude
              );
              if (nuevoLimite !== null) {
                setLimit(nuevoLimite);
                if (nuevoLimite !== lastAnnouncedLimit.current) {
                  lastAnnouncedLimit.current = null; // fuerza re-anuncio
                }
              }
            } catch (e) {
              console.log("Error obteniendo límite OSM:", e);
            }
          }

          // 🔊 Lógica de voz y alertas
          if (speedKmH > limit + 3 && now >= nextAlertVoiceAt.current) {
            console.log("🚨 Voz: exceso de velocidad");
            speak(`Atención. Superas el límite de ${limit} kilómetros por hora.`, 2);
            nextAlertVoiceAt.current = now + 8000;
            Alert.alert("⚠️ Exceso de velocidad", `Velocidad actual: ${speedKmH.toFixed(1)} km/h`);
          }

          if (limit !== null && lastAnnouncedLimit.current !== limit && now >= nextLimitVoiceAt.current) {
            console.log("📢 Voz: nuevo límite detectado");
            lastAnnouncedLimit.current = limit;
            speak(`Nuevo límite de velocidad: ${limit} kilómetros por hora.`, 1);
            nextLimitVoiceAt.current = now + 10000;
          }

          if (speedKmH > 2 && now >= nextSpeedVoiceAt.current && LAST_PRIORITY.current < 2) {
            console.log("ℹ️ Voz: velocidad actual");
            speak(`Tu velocidad actual es ${speedKmH.toFixed(0)} kilómetros por hora.`, 0);
            nextSpeedVoiceAt.current = now + 20000;
          }

          // 🔧 Ahora usamos la ref para enviar puntos
          if (isTrackingRef.current && recorridoId.current) {
            console.log(
              "Enviando punto:",
              recorridoId.current,
              loc.coords.latitude,
              loc.coords.longitude,
              speedKmH
            );

            enviarTracking(recorridoId.current, loc.coords.latitude, loc.coords.longitude, speedKmH)
              .catch((e) => console.log("Error enviando tracking:", e));
          }
        }
      );
    })();

    return () => {
      if (locationSubscription) locationSubscription.remove();
      void stopTracking();
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
        <Text style={styles.tittleIdx}>Velocidad actual</Text>
        <Text style={styles.speed}>{speed} km/h</Text>
        <Text style={styles.limit}>Límite: {limit} km/h</Text>
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.btn, isTracking ? styles.btnStop : styles.btnStart]}
          onPress={isTracking ? stopTracking : startTracking}
        >
          <Text style={styles.btnText}>
            {isTracking ? "Parar recorrido" : "Iniciar recorrido"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(isDarkMode: boolean) {
  return StyleSheet.create({
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
    title: { fontSize: 22, fontWeight: "bold", color: isDarkMode ? "#fff" : "#000" },
    tittleIdx: { fontSize: 22, fontWeight: "bold", color: "#000" },
    speed: { fontSize: 42, fontWeight: "bold", color: "red" },
    limit: { fontSize: 18, color: "gray" },
    bottomButtons: {
      position: "absolute",
      bottom: 40,
      flexDirection: "row",
      justifyContent: "center",
      width: "100%",
    },
    btn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
    btnStart: { backgroundColor: "#2BAEEF" },
    btnStop: { backgroundColor: "#E74C3C" },
    btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  });
}
