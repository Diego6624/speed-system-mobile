import { register } from "@/services/regist";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

export default function RegisterScreen() {
  const theme = useColorScheme();

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

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleRegister = async () => {
    try {
      const res = await register(nombre, apellido, correo, password);
      console.log("Respuesta del backend:", res.data);

      Alert.alert("Cuenta creada", "Tu cuenta fue creada exitosamente ✔", [
        {
          text: "Ir al login",
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch (error: any) {
      console.log("ERROR REGISTER:", error.response?.data || error.message);
      Alert.alert("Error", "No se pudo crear la cuenta ❌");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Crear cuenta</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        Regístrate para comenzar
      </Text>

      <TextInput
        placeholder="Nombre"
        placeholderTextColor="#888"
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.inputBorder,
            color: colors.text,
          },
        ]}
        onChangeText={setNombre}
      />

      <TextInput
        placeholder="Apellido"
        placeholderTextColor="#888"
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.inputBorder,
            color: colors.text,
          },
        ]}
        onChangeText={setApellido}
      />

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
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setCorreo}
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
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.buttonBg }]}
        onPress={handleRegister}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>

      {mensaje ? (
        <Text style={[styles.message, { color: colors.text }]}>{mensaje}</Text>
      ) : null}

      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={[styles.link, { color: colors.link }]}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
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
  message: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
