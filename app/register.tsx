import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext"; // 👈 usar ThemeContext global
import { register } from "@/services/regist";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const { t } = useLanguage();
  const { darkMode } = useTheme(); // 👈 ahora viene del toggle global

  const styles = createStyles(darkMode);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleRegister = async () => {
    try {
      const res = await register(nombre, apellido, correo, password);
      console.log("Respuesta del backend:", res.data);

      Alert.alert(t("cuentaCreada"), t("cuentaCreadaExito"), [
        {
          text: t("irLogin"),
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch (error: any) {
      console.log("ERROR REGISTER:", error.response?.data || error.message);
      Alert.alert(t("error"), t("errorCrearCuenta"));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("crearCuenta")}</Text>
      <Text style={styles.subtitle}>{t("registrateComenzar")}</Text>

      <TextInput
        placeholder={t("nombre")}
        placeholderTextColor={styles.placeholder.color}
        style={styles.input}
        onChangeText={setNombre}
      />

      <TextInput
        placeholder={t("apellido")}
        placeholderTextColor={styles.placeholder.color}
        style={styles.input}
        onChangeText={setApellido}
      />

      <TextInput
        placeholder={t("correoElectronico")}
        placeholderTextColor={styles.placeholder.color}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setCorreo}
      />

      <TextInput
        placeholder={t("contrasena")}
        placeholderTextColor={styles.placeholder.color}
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.8}>
        <Text style={styles.buttonText}>{t("crearCuenta")}</Text>
      </TouchableOpacity>

      {mensaje ? <Text style={styles.message}>{mensaje}</Text> : null}

      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={styles.link}>{t("yaCuenta")}</Text>
      </TouchableOpacity>
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
    message: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
      color: isDarkMode ? "#fff" : "#000",
    },
  });
}
