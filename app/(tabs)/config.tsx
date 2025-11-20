import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const { logoutUser } = useAuth();
  const theme = useColorScheme();

  const colors = theme === "dark"
    ? {
        bg: "#000",
        text: "#fff",
        cardBg: "#111",
        border: "#333",
        icon: "#ccc",
        logout: "#ff4444",
      }
    : {
        bg: "#f2f2f2",
        text: "#333",
        cardBg: "#fff",
        border: "#eee",
        icon: "#555",
        logout: "#e74c3c",
      };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.headerWrapper}>
        <MaterialIcons name="settings" size={32} color={colors.icon} />
        <Text style={[styles.header, { color: colors.text }]}>Ajustes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sección: Preferencias */}
        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
          <SettingRow
            icon="language"
            label="Idioma"
            type="link"
            colors={colors}
          />
          <SettingRow
            icon="notifications"
            label="Notificaciones"
            type="toggle"
            value={notificationsEnabled}
            onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
            colors={colors}
          />
          <SettingRow
            icon="lock"
            label="Privacidad"
            type="link"
            colors={colors}
          />
          <SettingRow
            icon="dark-mode"
            label="Modo oscuro"
            type="toggle"
            value={darkModeEnabled}
            onToggle={() => setDarkModeEnabled(!darkModeEnabled)}
            colors={colors}
          />
        </View>

        {/* Sección: Cuenta */}
        <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
          <SettingRow
            icon="info"
            label="Acerca de"
            type="link"
            colors={colors}
          />
          <TouchableOpacity style={styles.row} onPress={logoutUser}>
            <View style={styles.left}>
              <MaterialIcons
                name="logout"
                size={24}
                color={colors.logout}
                style={styles.icon}
              />
              <Text style={[styles.label, { color: colors.logout, fontWeight: "600" }]}>
                Cerrar sesión
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

type RowProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  type: "toggle" | "link";
  value?: boolean;
  onToggle?: () => void;
  colors: any;
};

function SettingRow({ icon, label, type, value, onToggle, colors }: RowProps) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.left}>
        <MaterialIcons
          name={icon}
          size={24}
          color={colors.icon}
          style={styles.icon}
        />
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>
      {type === "toggle" ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#ccc", true: "#4cd137" }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
        />
      ) : (
        <MaterialIcons name="chevron-right" size={24} color={colors.icon} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },
  label: {
    fontSize: 16,
  },
});
