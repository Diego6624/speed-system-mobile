import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { obtenerLimiteVelocidad } from "@/services/speedLimit";
import { enviarTracking, finalizarRecorrido, iniciarRecorrido } from "@/services/trackingService";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function IndexScreen() {
  const [location, setLocation] = useState<any>(null);
  const [speed, setSpeed] = useState(0);
  const [limit, setLimit] = useState(40); // valor inicial
  const [isTracking, setIsTracking] = useState(false);

  const recorridoId = useRef<number | null>(null);
  const isTrackingRef = useRef(false);

  // Cooldowns
  const nextSpeedVoiceAt = useRef(0);
  const nextAlertVoiceAt = useRef(0);
  const nextLimitVoiceAt = useRef(0);
  const lastAnnouncedLimit = useRef<number | null>(null);
  const nextLimitFetchAt = useRef(0);
  const LAST_PRIORITY = useRef<0 | 1 | 2>(0);

  const lastSpokenText = useRef<string | null>(null);

  const { user } = useAuth();
  const USER_ID = user?.id;

  const { t } = useLanguage();
  const { darkMode } = useTheme();
  const styles = createStyles(darkMode);

  const speak = (text: string, priority: 0 | 1 | 2 = 0) => {
    if (priority < LAST_PRIORITY.current) return;
    if (priority === 2) Speech.stop();

    if (lastSpokenText.current === text) return;
    lastSpokenText.current = text;

    LAST_PRIORITY.current = priority;
    Speech.speak(text, {
      language: "es-ES",
      rate: 0.95,
      onDone: () => {
        LAST_PRIORITY.current = 0;
        lastSpokenText.current = null;
      },
    });
  };

  const startTracking = async () => {
    try {
      const data = await iniciarRecorrido();
      recorridoId.current = data.id;
      isTrackingRef.current = true;
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
      isTrackingRef.current = false;
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
        Alert.alert(t("permisoDenegado"), t("activaUbicacion"));
        return; // 👈 salimos y no configuramos nada más
      }

      // 👇 solo se ejecuta si el permiso fue concedido
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1500,
          distanceInterval: 4,
        },
        async (loc) => {
          if (!loc?.coords) return;

          setLocation(loc.coords);
          const speedMs = loc.coords.speed ?? 0;
          const speedKmH = Math.max(0, Math.min(speedMs * 3.6, 150));
          setSpeed(Number(speedKmH.toFixed(1)));

          const now = Date.now();

          // Límite de velocidad
          if (now >= nextLimitFetchAt.current) {
            nextLimitFetchAt.current = now + 7000;
            try {
              const nuevoLimite = await obtenerLimiteVelocidad(
                loc.coords.latitude,
                loc.coords.longitude
              );
              if (nuevoLimite !== null) {
                setLimit(nuevoLimite);
                console.log("✅ Límite actualizado:", nuevoLimite);
              }
            } catch (e) {
              console.log("Error obteniendo límite OSM:", e);
            }
          }

          // Voz y alertas
          if (speedKmH > limit + 3 && now >= nextAlertVoiceAt.current) {
            speak(`${t("vozExcesoVelocidad")} ${limit} ${t("kilometersPerHour")}`, 2);
            nextAlertVoiceAt.current = now + 8000;
            Alert.alert(`⚠️ ${t("excesoVelocidad")}`, `${t("velocidadActual")}: ${speedKmH.toFixed(1)} km/h`);
          }

          if (limit !== null && lastAnnouncedLimit.current !== limit && now >= nextLimitVoiceAt.current) {
            lastAnnouncedLimit.current = limit;
            speak(`${t("vozNuevoLimite")} ${limit} ${t("kilometersPerHour")}`, 1);
            nextLimitVoiceAt.current = now + 10000;
          }

          if (speedKmH > 2 && now >= nextSpeedVoiceAt.current && LAST_PRIORITY.current < 2) {
            speak(`${t("vozVelocidadActual")} ${speedKmH.toFixed(0)} ${t("kilometersPerHour")}`, 0);
            nextSpeedVoiceAt.current = now + 20000;
          }

          if (isTrackingRef.current && recorridoId.current) {
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
        <Text style={styles.title}>{t("cargandoUbicacion")}</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      {location ? (
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
          <Marker coordinate={location} title={t("tuUbicacion")} />
        </MapView>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>{t("cargandoUbicacion")}</Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.tittleIdx}>{t("velocidadActual")}</Text>
        <Text style={styles.speed}>{speed} km/h</Text>
        <Text style={styles.limit}>{t("limite")}: {limit} km/h</Text>
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.btn, isTracking ? styles.btnStop : styles.btnStart]}
          onPress={isTracking ? stopTracking : startTracking}
        >
          <FontAwesome
            name={isTracking ? "stop" : "play"}
            size={22}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.btnText}>
            {isTracking ? t("pararRecorrido") : t("iniciarRecorrido")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(isDarkMode: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 130,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffffff",
    },
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
    btn: {
      flexDirection: "row", // 👈 icono + texto
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 30,
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    btnStart: {
      backgroundColor: "#2BAEEF",
    },
    btnStop: {
      backgroundColor: "#E74C3C",
    },
    btnText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  });
}
