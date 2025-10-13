# 📱 Speed System Mobile

Aplicación móvil desarrollada en **React Native (Expo)** que calcula la **velocidad de desplazamiento del usuario** usando el **GPS y el giroscopio** del dispositivo.  
Incluye **alertas visuales y de voz** cuando se supera el límite de velocidad establecido.

---

## 🚀 Funcionalidades principales
- Muestra la **velocidad actual** del usuario en tiempo real (km/h).
- Alerta con **voz y notificación** si se supera el límite de velocidad.
- Usa **mapa en vivo** con ubicación actual.
- Sistema de **control por voz** con intervalos configurables.
- Lógica estable y anti-bucle para lecturas del GPS.

---

## 🧩 Tecnologías utilizadas

| Tecnología | Uso principal |
|-------------|----------------|
| **React Native (Expo)** | Framework principal para desarrollo móvil |
| **Expo Location** | Acceso a ubicación y velocidad del dispositivo |
| **Expo Speech** | Generación de notificaciones por voz |
| **React Native Maps** | Renderizado del mapa en tiempo real |
| **TypeScript / JavaScript** | Lógica de la app |

---

## ⚙️ Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

### 🧱 Herramientas base
| Herramienta | Requisito |
|--------------|-----------|
| [Node.js](https://nodejs.org/) | v18 o superior |
| npm | viene con Node.js |
| [Git](https://git-scm.com/downloads) | para clonar el repositorio |
| [Expo CLI (local)](https://docs.expo.dev/get-started/installation/) | usar con `npx` |

### 📱 En tu celular
1. Instala la app **Expo Go** desde Play Store o App Store.  
2. Inicia sesión (opcional pero recomendado).  
3. Conéctate a la **misma red WiFi** que tu computadora.

---

## 🧭 Instalación paso a paso

### 1️⃣ Clonar el proyecto
```bash
git clone https://github.com/<tu-usuario>/speed-system-mobile.git
cd speed-system-mobile
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Instalar paquetes faltantes manualmente (si fuera necesario)
```bash
npx expo install expo-location expo-speech react-native-maps
```

### 4️⃣ Iniciar el proyecto (modo desarrollo)
```bash
npx expo start --tunnel
```
> Usa `--tunnel` si tus compañeros quieren probarlo desde sus celulares usando datos móviles.

### 5️⃣ Escanear el código QR
- Abre **Expo Go** en el teléfono.
- Escanea el código QR mostrado en consola o en el navegador.

---

## 🧠 Ramas del proyecto

| Rama | Propósito |
|-------|------------|
| `main` | Versión estable lista para entrega |
| `develop` | Rama de desarrollo (donde se prueban nuevas funciones) |
| `feature/...` | Ramas individuales por tarea o módulo |

Ejemplo:
```bash
git checkout -b feature/voz-notificaciones
```

---

## 🗂️ Estructura principal del proyecto
```
speed-system-mobile/
│
├── app/                # Código fuente principal
│   ├── (tabs)/index.tsx     # Pantalla principal (Mapa + Velocidad)
│
├── assets/             # Iconos e imágenes
├── node_modules/       # Dependencias
├── package.json        # Configuración de npm y scripts
├── README.md           # Este archivo
└── .gitignore          # Archivos ignorados por Git
```

---

## 🧰 Comandos útiles

| Acción | Comando |
|--------|----------|
| Iniciar el proyecto | `npx expo start` |
| Limpiar caché | `npx expo start -c` |
| Crear nueva rama | `git checkout -b nombre-de-rama` |
| Subir cambios a GitHub | `git push origin nombre-de-rama` |

---

## 🛠️ Errores comunes y soluciones

| Problema | Solución |
|-----------|-----------|
| `expo-speech` o `expo-location` no instalado | Ejecutar `npx expo install expo-speech expo-location` |
| No carga la ubicación | Verificar permisos de ubicación en el celular |
| Error “ngrok tunnel took too long” | Cierra Expo y reintenta `npx expo start --tunnel` |
| No se escucha la voz | Verifica el volumen multimedia del teléfono |
| GPS se queda en 0 | Probar al aire libre, el GPS no funciona bien en interiores |
