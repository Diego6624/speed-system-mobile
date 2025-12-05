import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext"; // 👈 usar ThemeContext global
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const { loginUser, loading } = useAuth();
  const { t } = useLanguage();
  const { darkMode } = useTheme(); // 👈 ahora viene del toggle global

  const styles = createStyles(darkMode);

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setErrorMsg("");
    const ok = await loginUser(correo, password);

    if (!ok) {
      setErrorMsg(t("errorCredenciales"));
      return;
    }

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("bienvenido")}</Text>
      <Text style={styles.subtitle}>{t("iniciaSesion")}</Text>

      <TextInput
        placeholder={t("correoElectronicoLogin")}
        placeholderTextColor={styles.placeholder.color}
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder={t("contrasena")}
        placeholderTextColor={styles.placeholder.color}
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{t("ingresar")}</Text>
        )}
      </TouchableOpacity>

      <Link href="/register" style={styles.link}>
        {t("noCuenta")}
      </Link>
    </View>
  );
}

function createStyles(isDarkMode: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 30,
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffffff",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
      color: isDarkMode ? "#fff" : "#000",
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 30,
      opacity: 0.8,
      color: isDarkMode ? "#ddd" : "#555",
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
      backgroundColor: isDarkMode ? "#111" : "#fff",
      borderColor: isDarkMode ? "#333" : "#ddd",
      color: isDarkMode ? "#fff" : "#000",
    },
    placeholder: {
      color: isDarkMode ? "#888" : "#999",
    },
    button: {
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 10,
      backgroundColor: isDarkMode ? "#1e90ff" : "#007bff",
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "600",
    },
    link: {
      textAlign: "center",
      marginTop: 25,
      fontSize: 15,
      fontWeight: "500",
      color: isDarkMode ? "#1e90ff" : "#007bff",
    },
    errorText: {
      color: "#e74c3c",
      textAlign: "center",
      marginBottom: 15,
      fontSize: 14,
    },
  });
}
