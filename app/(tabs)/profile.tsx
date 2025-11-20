import { useAuth } from "@/context/AuthContext";
import { updateUsuario } from "@/services/user";
import { Ionicons } from "@expo/vector-icons"; // 👈 iconos de Expo
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function ProfileScreen() {
  const { user, token } = useAuth();
  const theme = useColorScheme();

  const colors = theme === "dark"
    ? {
        bg: "#000",
        text: "#fff",
        inputBg: "#111",
        inputBorder: "#333",
        buttonBg: "#1e90ff",
      }
    : {
        bg: "#f9f9f9",
        text: "#000",
        inputBg: "#fff",
        inputBorder: "#ddd",
        buttonBg: "#007bff",
      };

  const [nombre, setNombre] = useState(user?.nombre || "");
  const [apellido, setApellido] = useState(user?.apellido || "");
  const [correo, setCorreo] = useState(user?.correo || "");
  const [password, setPassword] = useState("");

  const handleUpdate = async () => {
    try {
      const updated = await updateUsuario(token!, {
        id: user.id,
        nombre,
        apellido,
        correo,
        password,
        fechaRegistro: user.fechaRegistro,
      });

      Alert.alert("Perfil actualizado", "Tus datos se guardaron correctamente ✔");
      console.log("Usuario actualizado:", updated);
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      Alert.alert("Error", "No se pudo actualizar el perfil ❌");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Ionicons
        name="person-circle-outline"
        size={80}
        color={colors.buttonBg}
        style={{ alignSelf: "center", marginBottom: 10 }}
      />
      <Text style={[styles.title, { color: colors.text }]}>Mi Perfil</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Actualiza tu información personal
      </Text>

      {/* Nombre */}
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={20} color={colors.buttonBg} style={styles.icon} />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
          ]}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
          placeholderTextColor="#888"
        />
      </View>

      {/* Apellido */}
      <View style={styles.inputWrapper}>
        <Ionicons name="id-card-outline" size={20} color={colors.buttonBg} style={styles.icon} />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
          ]}
          value={apellido}
          onChangeText={setApellido}
          placeholder="Apellido"
          placeholderTextColor="#888"
        />
      </View>

      {/* Correo */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color={colors.buttonBg} style={styles.icon} />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
          ]}
          value={correo}
          onChangeText={setCorreo}
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* Contraseña */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color={colors.buttonBg} style={styles.icon} />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
          ]}
          value={password}
          onChangeText={setPassword}
          placeholder="Nueva contraseña"
          placeholderTextColor="#888"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.buttonBg }]}
        onPress={handleUpdate}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    opacity: 0.7,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
