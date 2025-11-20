import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme'; // 👈 tu archivo de colores
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();

  console.log("Usuario:", user);
  console.log("ID usuario:", user?.id);

  if (loading) {
    return (
      <View
        style={[
          styles.loaderContainer,
          { backgroundColor: Colors[colorScheme ?? 'light'].background },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? 'light'].tint}
          style={{ marginBottom: 20 }}
        />
        <Text
          style={[
            styles.loaderText,
            { color: Colors[colorScheme ?? 'light'].text },
          ]}
        >
          Cargando sesión...
        </Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>

      {!user && <Redirect href="/login" />}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loaderText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
});
