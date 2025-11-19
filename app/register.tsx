import { register } from "@/services/regist";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

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
            bg: "#fff",
            text: "#000",
            inputBg: "#f3f3f3",
            inputBorder: "#ccc",
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

            Alert.alert(
                "Cuenta creada",
                "Tu cuenta fue creada exitosamente ✔",
                [
                    {
                        text: "Ir al login",
                        onPress: () => router.replace("/login"),
                    }
                ]
            );

        } catch (error: any) {
            console.log("ERROR REGISTER:", error.response?.data || error.message);

            Alert.alert("Error", "No se pudo crear la cuenta ❌");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <Text style={[styles.title, { color: colors.text }]}>Crear cuenta</Text>
            <TextInput
                placeholder="Nombre"
                placeholderTextColor="#888"
                style={[
                    styles.input,
                    { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
                ]}
                onChangeText={setNombre}
            />

            <TextInput
                placeholder="Apellido"
                placeholderTextColor="#888"
                style={[
                    styles.input,
                    { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
                ]}
                onChangeText={setApellido}
            />

            <TextInput
                placeholder="Correo"
                placeholderTextColor="#888"
                style={[
                    styles.input,
                    { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
                ]}
                onChangeText={setCorreo}
            />

            <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#888"
                style={[
                    styles.input,
                    { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text },
                ]}
                secureTextEntry
                onChangeText={setPassword}
            />

            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.buttonBg }]}
                onPress={handleRegister}

            >
                <Text style={{ color: "white", fontSize: 15 }}>
                    Crear cuenta
                </Text>
            </TouchableOpacity>

            {mensaje ? (
                <Text style={{ color: colors.text, marginTop: 20, fontSize: 16 }}>
                    {mensaje}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, justifyContent: "center" },
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
