import * as Location from "expo-location";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function IndexScreen() {
  const [location, setLocation] = useState<any>(null);
  const [speed, setSpeed] = useState(0);
  const [limit, setLimit] = useState(40);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const lastAlertTime = useRef(0);
  const lastSpeedVoiceTime = useRef(0);
  const isSpeaking = useRef(false);

  // 🗣 Función segura de voz
  const speak = async (text: string, priority = false) => {
    if (isSpeaking.current && !priority) return;
    if (priority) Speech.stop();

    isSpeaking.current = true;
    Speech.speak(text, {
      language: "es-ES",
      rate: 0.95,
      onDone: () => {
        isSpeaking.current = false;
      },
    });
  };

  // 🚀 Activar voz manualmente (para iOS)
  const handleEnableVoice = () => {
    Speech.speak("Voz activada correctamente.", {
      language: "es-ES",
      rate: 1.0,
      onDone: () => setVoiceEnabled(true),
    });
  };

  useEffect(() => {
    if (!voiceEnabled) return;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Activa la ubicación para continuar");
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1500, // Actualiza cada 1.5 segundos
          distanceInterval: 4, // O cada 4 metros
        },
        (loc) => {
          const speedMs = loc.coords.speed ?? 0;
          const speedKmH = Math.max(0, Math.min(speedMs * 3.6, 150));
          setSpeed(Number(speedKmH.toFixed(1)));
          setLocation(loc.coords);

          // 🚫 Ignorar velocidades muy bajas (ruido GPS)
          if (speedKmH < 2) return;

          const now = Date.now();
          const tolerance = 3; // margen de error
          const cooldownVoice = 20000; // 20s entre mensajes de voz
          const cooldownAlert = 30000; // 30s entre alertas visuales

          // 🔊 Anuncio periódico de velocidad
          if (now - lastSpeedVoiceTime.current > cooldownVoice && !isSpeaking.current) {
            speak(`Tu velocidad actual es de ${speedKmH.toFixed(0)} kilómetros por hora.`);
            lastSpeedVoiceTime.current = now;
          }

          // ⚠️ Aviso por exceso de velocidad
          if (speedKmH > limit + tolerance && now - lastAlertTime.current > cooldownAlert) {
            lastAlertTime.current = now;
            speak(`Atención. Has superado el límite de velocidad de ${limit} kilómetros por hora.`, true);

            setTimeout(() => {
              Alert.alert(
                "⚠️ Exceso de velocidad",
                `Tu velocidad actual es ${speedKmH.toFixed(1)} km/h`
              );
            }, 500);
          }
        }
      );
    })();
  }, [voiceEnabled]);

  // 🟠 Pantalla inicial para activar voz
  if (!voiceEnabled) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🔈 Activar voz</Text>
        <Text style={{ color: "gray", marginTop: 10 }}>
          Toca el botón para habilitar la voz (necesario en iPhone)
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleEnableVoice}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            Activar voz
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#181818ff" },
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
  title: { fontSize: 22, fontWeight: "bold", color: "black" },
  speed: { fontSize: 42, color: "red", fontWeight: "bold" },
  limit: { fontSize: 18, color: "gray" },
  button: {
    marginTop: 40,
    backgroundColor: "orange",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
});
