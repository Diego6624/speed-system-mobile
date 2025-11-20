import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

function RootLayoutContent() {
  const colorScheme = useColorScheme();

  const { user, loading } = useAuth();
  console.log("Usuario:", user);
  console.log("ID usuario:", user?.id);

  if (loading) return null;

  const isLogged = !!user;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {isLogged ? (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
          </>
        )}
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>

      {/* ✔️ ESTE StatusBar SÍ ES VÁLIDO AQUÍ */}
      <StatusBar style="auto" />
    </>
  );
}
