import { useAuth } from "@/hooks/useAuth";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const { loginUser, loading } = useAuth();
  const theme = useColorScheme();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const colors = theme === "dark"
    ? {
      bg: "#000",
      text: "#fff",
      inputBg: "#111",
      inputBorder: "#333",
      buttonBg: "#1e90ff",
      link: "#1e90ff",
    }
    : {
      bg: "#fff",
      text: "#000",
      inputBg: "#f3f3f3",
      inputBorder: "#ccc",
      buttonBg: "#007bff",
      link: "#007bff",
    };

  const handleLogin = async () => {
    const ok = await loginUser(correo, password);

    if (!ok) {
      setErrorMsg("Correo o contraseña incorrectos");
      return;
    }

    Alert.alert(
      "Inicio de sesión",
      "Has iniciado sesión exitosamente ✔",
      [
        {
          text: "OK",
          onPress: () => router.replace("/"),
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo"
        placeholderTextColor="#888"
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.inputBorder,
            color: colors.text,
          },
        ]}
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#888"
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.inputBorder,
            color: colors.text,
          },
        ]}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {errorMsg ? (
        <Text style={{ color: "red", textAlign: "center", marginBottom: 15 }}>
          {errorMsg}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.buttonBg }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          {loading ? "Ingresando..." : "Ingresar"}
        </Text>
      </TouchableOpacity>

      <Link
        href="/register"
        style={{ color: colors.link, textAlign: "center", marginTop: 20 }}
      >
        Crear cuenta
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
