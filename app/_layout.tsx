import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";

function RootLayoutContent() {
  const { darkMode } = useTheme();
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  const styles = createStyles(darkMode);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={styles.tint.color} style={{ marginBottom: 20 }} />
        <Text style={styles.loaderText}>{t("cargandoSesion")}</Text>
      </View>
    );
  }

  return (
    <NavigationThemeProvider value={darkMode ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>

      {!user && <Redirect href="/login" />}
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <RootLayoutContent />
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </>
  );
}

function createStyles(isDarkMode: boolean) {
  return StyleSheet.create({
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffffff",
    },
    loaderText: {
      fontSize: 18,
      fontWeight: "500",
      textAlign: "center",
      color: isDarkMode ? "#fff" : "#000",
    },
    tint: {
      color: isDarkMode ? "#1e90ff" : "#007bff",
    },
  });
}
