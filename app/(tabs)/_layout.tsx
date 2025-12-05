import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext"; // 👈 usar ThemeContext global
import { Redirect, Tabs } from 'expo-router';

export default function TabLayout() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { darkMode } = useTheme(); // 👈 ahora viene del toggle global

  // 🚨 Si no hay usuario, redirige al login
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: darkMode ? "#67E8F9" : "#2BAEEF", // 👈 contraste en ambos modos
        tabBarInactiveTintColor: darkMode ? "#aaa" : "#555",
        tabBarStyle: {
          backgroundColor: darkMode ? "#0f172a" : "#fff", // 👈 fondo dinámico
          borderTopColor: darkMode ? "#1e293b" : "#ddd",
        },
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="history"
        options={{
          title: t("historial"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="35.circle.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="analysis"
        options={{
          title: t("analisis"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="figure.surfing.circle.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: t("inicio"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t("perfil"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="03.circle.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="config"
        options={{
          title: t("ajustes"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="coloncurrencysign.circle.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
