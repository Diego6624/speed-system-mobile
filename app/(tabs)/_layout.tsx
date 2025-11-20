import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="35.circle.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Análisis',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="figure.surfing.circle.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="03.circle.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="config"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="coloncurrencysign.circle.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
