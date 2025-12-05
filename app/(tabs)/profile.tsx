import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { updateUsuario } from "@/services/user";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const { darkMode } = useTheme(); 

  const styles = createStyles(darkMode);

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

      Alert.alert(t("perfilActualizado"), t("datosGuardadosCorrectamente"));
      console.log("Usuario actualizado:", updated);
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      Alert.alert(t("error"), t("errorActualizarPerfil"));
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="person-circle-outline"
        size={80}
        color={styles.iconColor.color}
        style={{ alignSelf: "center", marginBottom: 10 }}
      />
      <Text style={styles.title}>{t("miPerfil")}</Text>
      <Text style={styles.subtitle}>{t("actualizaInformacion")}</Text>

      {/* Nombre */}
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={20} color={styles.iconColor.color} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder={t("nombre")}
          placeholderTextColor={styles.placeholder.color}
        />
      </View>

      {/* Apellido */}
      <View style={styles.inputWrapper}>
        <Ionicons name="id-card-outline" size={20} color={styles.iconColor.color} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={apellido}
          onChangeText={setApellido}
          placeholder={t("apellido")}
          placeholderTextColor={styles.placeholder.color}
        />
      </View>

      {/* Correo */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color={styles.iconColor.color} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
          placeholder={t("correoElectronico")}
          placeholderTextColor={styles.placeholder.color}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* Contraseña */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color={styles.iconColor.color} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder={t("nuevaContrasena")}
          placeholderTextColor={styles.placeholder.color}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate} activeOpacity={0.8}>
        <Text style={styles.buttonText}>{t("guardarCambios")}</Text>
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
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 5,
      color: isDarkMode ? "#fff" : "#000",
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 25,
      opacity: 0.8,
      color: isDarkMode ? "#ddd" : "#555",
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 12,
      marginBottom: 15,
      paddingHorizontal: 10,
      backgroundColor: isDarkMode ? "#111" : "#fff",
      borderColor: isDarkMode ? "#333" : "#ddd",
    },
    icon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: isDarkMode ? "#fff" : "#000",
    },
    placeholder: {
      color: isDarkMode ? "#888" : "#999",
    },
    iconColor: {
      color: isDarkMode ? "#1e90ff" : "#007bff",
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
  });
}
