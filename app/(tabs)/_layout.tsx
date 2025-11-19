import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs, useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.replace("/login");
      }
      setChecked(true);
    };
    checkAuth();
  }, []);

  if (!checked) return null;
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      headerShown: false,
      tabBarButton: HapticTab,
    }}
      initialRouteName='index'
    >
      <Tabs.Screen
        name="history" // nombre del archivo
        options={{
          title: 'Historial', // titulo en la barra
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="35.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analysis" // nombre del archivo
        options={{
          title: 'Análisis', // titulo en la barra
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="figure.surfing.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index" // nombre del archivo
        options={{
          title: 'Inicio', // titulo en la barra
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile" // nombre del archivo
        options={{
          title: 'Perfil', // titulo en la barra
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="03.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="config" // nombre del archivo
        options={{
          title: 'Ajustes', // titulo en la barra
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="coloncurrencysign.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
