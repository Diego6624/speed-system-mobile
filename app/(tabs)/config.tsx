import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ajustes</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sección: Preferencias */}
        <View style={styles.card}>
          <SettingRow
            icon="language"
            label="Idioma"
            type="link"
          />
          <SettingRow
            icon="notifications"
            label="Notificaciones"
            type="toggle"
            value={notificationsEnabled}
            onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
          />
          <SettingRow
            icon="lock"
            label="Privacidad"
            type="link"
          />
          <SettingRow
            icon="dark-mode"
            label="Modo oscuro"
            type="toggle"
            value={darkModeEnabled}
            onToggle={() => setDarkModeEnabled(!darkModeEnabled)}
          />
        </View>

        {/* Sección: Cuenta */}
        <View style={styles.card}>
          <SettingRow
            icon="info"
            label="Acerca de"
            type="link"
          />
          <TouchableOpacity style={styles.row}>
            <View style={styles.left}>
              <MaterialIcons name="logout" size={24} color="#e74c3c" style={styles.icon} />
              <Text style={[styles.label, { color: '#e74c3c' }]}>Cerrar sesión</Text>
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
  type: 'toggle' | 'link';
  value?: boolean;
  onToggle?: () => void;
};

function SettingRow({ icon, label, type, value, onToggle }: RowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <MaterialIcons name={icon} size={24} color="#555" style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#ccc', true: '#4cd137' }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <MaterialIcons name="chevron-right" size={24} color="#999" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});

