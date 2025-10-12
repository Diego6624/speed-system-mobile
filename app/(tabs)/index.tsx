import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, Dimensions } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function IndexScreen() {
  const [location, setLocation] = useState<any>(null);
  const [speed, setSpeed] = useState(0);
  const [limit, setLimit] = useState(60);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Activa la ubicación para continuar");
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 500, // cada 0.5 segundos
          distanceInterval: 2, // solo si se movió al menos 2 metros
        },
        (loc) => {
          // ✅ Guarda la ubicación actual
          setLocation(loc.coords);

          const speedMs = loc.coords.speed ?? 0;
          let speedKmH = speedMs * 3.6;

          // 🔧 Corrige valores falsos (si el GPS salta)
          if (speedKmH < 0 || speedKmH > 150) speedKmH = 0;

          setSpeed(Number(speedKmH.toFixed(1)));

          // Condiciones
          
          // Condicion limite de velocidad
          if (speedKmH > limit) {
            Alert.alert(
              "⚠️ Exceso de velocidad",
              `Tu velocidad actual es ${speedKmH.toFixed(1)} km/h`
            );
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
        showsUserLocation={true}
        followsUserLocation={true}
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
  map: { width: Dimensions.get("window").width, height: Dimensions.get("window").height},
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
