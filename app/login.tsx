import { useAuth } from "@/context/AuthContext";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
        bg: "#f9f9f9",
        text: "#000",
        inputBg: "#fff",
        inputBorder: "#ddd",
        buttonBg: "#007bff",
        link: "#007bff",
      };

  const handleLogin = async () => {
    setErrorMsg("");
    const ok = await loginUser(correo, password);

    if (!ok) {
      setErrorMsg("Correo o contraseña incorrectos");
      return;
    }

    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Bienvenido 👋</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Inicia sesión para continuar
      </Text>

      <TextInput
        placeholder="Correo electrónico"
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
        keyboardType="email-address"
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
        <Text style={[styles.errorText]}>{errorMsg}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.buttonBg }]}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ingresar</Text>
        )}
      </TouchableOpacity>

      <Link
        href="/register"
        style={[styles.link, { color: colors.link }]}
      >
        ¿No tienes cuenta? Crear una
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  link: {
    textAlign: "center",
    marginTop: 25,
    fontSize: 15,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
  },
});
