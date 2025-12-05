import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Language } from "@/hooks/use-translations";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type RowProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  type: "toggle" | "link";
  value?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  darkMode?: boolean;
};

export default function SettingsScreen() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { logoutUser } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showIdiomaModal, setShowIdiomaModal] = useState(false);
  const [showPrivacidadModal, setShowPrivacidadModal] = useState(false);
  const [showAcercaModal, setShowAcercaModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const styles = createStyles(darkMode);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("ajustes")}</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Preferencias */}
        <View style={styles.card}>
          <SettingRow
            icon="language"
            label={`${t("idioma")}: ${language.toUpperCase()}`}
            type="link"
            onPress={() => setShowIdiomaModal(true)}
            darkMode={darkMode}
          />
          <SettingRow
            icon="notifications"
            label={t("notificaciones")}
            type="toggle"
            value={notificationsEnabled}
            onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
            darkMode={darkMode}
          />
          <SettingRow
            icon="lock"
            label={t("privacidad")}
            type="link"
            onPress={() => setShowPrivacidadModal(true)}
            darkMode={darkMode}
          />
          <SettingRow
            icon="dark-mode"
            label={t("modoOscuro")}
            type="toggle"
            value={darkMode}
            onToggle={toggleDarkMode}
            darkMode={darkMode}
          />
        </View>

        {/* Cuenta */}
        <View style={styles.card}>
          <SettingRow
            icon="info"
            label={t("acerca")}
            type="link"
            onPress={() => setShowAcercaModal(true)}
            darkMode={darkMode}
          />
        </View>

        {/* Botón cerrar sesión */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={() => setShowLogoutModal(true)}
        >
          <MaterialIcons name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>{t("cerrarSesion")}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modales (se mantienen igual) */}
      {/* Modal Idioma */}
      <Modal visible={showIdiomaModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t("seleccionaIdioma")}</Text>
            {[
              { code: "es", label: "Español" },
              { code: "en", label: "English" },
              { code: "fr", label: "Français" },
              { code: "pt", label: "Português" },
            ].map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={styles.actionBtn}
                onPress={() => {
                  setLanguage(lang.code as Language);
                  setShowIdiomaModal(false);
                }}
              >
                <Text style={styles.actionText}>{lang.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowIdiomaModal(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>{t("cerrar")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Privacidad */}
      <Modal visible={showPrivacidadModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t("opcionesPrivacidad")}</Text>
            {[
              { id: "password", label: "Cambiar contraseña" },
              { id: "permissions", label: "Configurar permisos" },
              { id: "twofa", label: "Activar doble autenticación" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={styles.actionBtn}
                onPress={() => setShowPrivacidadModal(false)}
              >
                <Text style={styles.actionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowPrivacidadModal(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>{t("cerrar")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Acerca */}
      <Modal visible={showAcercaModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t("acercaApp")}</Text>
            <Text style={styles.actionText}>{t("version")}</Text>
            <Text style={styles.actionText}>{t("desarrollada")}</Text>
            <TouchableOpacity onPress={() => setShowAcercaModal(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>{t("cerrar")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Logout */}
      <Modal visible={showLogoutModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t("confirmarCerrarSesion")}</Text>
            <View style={styles.confirmRow}>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#e74c3c" }]}
                onPress={() => {
                  setShowLogoutModal(false);
                  logoutUser();
                }}
              >
                <Text style={styles.confirmText}>{t("si")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#777" }]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.confirmText}>{t("no")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SettingRow({ icon, label, type, value, onToggle, onPress, darkMode }: RowProps) {
  const styles = createStyles(darkMode ?? false);
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={type === "link" ? 0.6 : 1}
      onPress={type === "link" ? onPress : undefined}
    >
      <View style={styles.left}>
        <MaterialIcons name={icon} size={24} color={darkMode ? "#fff" : "#555"} style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      {type === "toggle" ? (
        <Switch
          value={!!value}
          onValueChange={onToggle}
          trackColor={{ false: "#ccc", true: "#4cd137" }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
        />
      ) : (
        <MaterialIcons name="chevron-right" size={24} color={darkMode ? "#fff" : "#999"} />
      )}
    </TouchableOpacity>
  );
}

export function createStyles(isDarkMode: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
      paddingTop: 50,
      paddingHorizontal: 20,
    },
    header: {
      fontSize: 26,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 20,
      color: isDarkMode ? "#fff" : "#000",
    },
    scrollContent: {
      paddingBottom: 40,
    },

    // Tarjetas
    card: {
      borderRadius: 16,
      marginBottom: 20,
      backgroundColor: isDarkMode ? "#1e293b" : "#fff",
      borderWidth: 1,
      borderColor: isDarkMode ? "#414141ff" : "#cacacaff", // 👈 borde negro para diferenciar
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04, // 👈 sombra muy suave
      shadowRadius: 2,
      elevation: 1,
      overflow: "hidden",
    },

    // Filas
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 18,
      borderBottomColor: isDarkMode ? "#334155" : "#eee",
      borderBottomWidth: 1,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    left: { flexDirection: "row", alignItems: "center" },
    icon: { marginRight: 14 },
    label: {
      fontSize: 16,
      color: isDarkMode ? "#fff" : "#333",
      fontWeight: "500",
    },

    // Botón cerrar sesión destacado
    logoutBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#e74c3c",
      borderRadius: 12,
      paddingVertical: 14,
      marginTop: 10,
      borderWidth: 1,
      borderColor: "#000", // 👈 borde negro
    },
    logoutText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },

    // Modales
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalCard: {
      width: "90%",
      borderRadius: 16,
      padding: 20,
      backgroundColor: isDarkMode ? "#1e293b" : "#fff",
      borderWidth: 1,
      borderColor: "#000", // 👈 borde negro
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 16,
      textAlign: "center",
      color: isDarkMode ? "#fff" : "#000",
    },

    // Botones dentro de modales
    actionBtn: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      marginVertical: 6,
      backgroundColor: isDarkMode ? "#0f172a" : "#f2f2f2",
      borderWidth: 1,
      borderColor: "#000", // 👈 borde negro
    },
    actionText: {
      fontSize: 16,
      color: isDarkMode ? "#fff" : "#333",
      textAlign: "center",
    },

    // Confirmación cerrar sesión
    confirmRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    confirmBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      marginHorizontal: 6,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#000", // 👈 borde negro
    },
    confirmText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },

    // Botón cerrar modal
    closeBtn: {
      marginTop: 20,
      alignSelf: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      backgroundColor: "#4cd137",
      borderWidth: 1,
      borderColor: "#000", // 👈 borde negro
    },
    closeText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 15,
    },
  });
}