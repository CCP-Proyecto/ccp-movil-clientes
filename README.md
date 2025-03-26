# Aplicación móvil CCP Móvil Clientes

## Configuración del Entorno

### Prerequisitos

- Node.js >= 20.9.0
- Android Studio:
  - Seguir la [guía oficial de Expo](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=development-build&buildEnv=local) para la instalación y configuración de:
    - Android Studio
    - Android SDK
    - Variables de entorno (ANDROID_HOME)
  - Emulador Android configurado con:
    - API Level 35 (Android 15)
    - Otras versiones de Android también pueden funcionar, pero el desarrollo se realiza principalmente en API 35
- JDK 17:
  - Opciones de instalación para Windows:
    - [Microsoft OpenJDK 17](https://learn.microsoft.com/en-us/java/openjdk/download) (Recomendado)
  - Asegurarse de configurar JAVA_HOME en las variables de entorno del sistema operativo.

Para verificar que JDK está instalado correctamente:

```bash
java --version
```

## Instalación

1. Clonar el repositorio

```bash
git clone [url-del-repo]
```

2. Instalar dependencias

```bash
npm install
```

3. Instalar Expo Dev Client

```bash
npx expo install expo-dev-client
```

## Desarrollo local

Para ejecutar la aplicación en el emulador de Android:

```bash
npx expo run:android
```

## Builds Locales

Las builds generadas se encontrarán en:

- Debug: android/app/build/outputs/apk/debug/app-debug.apk

- Release: android/app/build/outputs/apk/release/app-release.apk

## Testing

### Configuración de Jest

Este proyecto utiliza Jest para pruebas unitarias. La configuración de Jest se maneja directamente en el `package.json` en la sección "jest", **NO en un archivo jest.config.ts separado**.

```json
{
  "jest": {
    "preset": "jest-expo"
    // Agregar aquí cualquier configuración adicional de Jest
  }
}
```

### Ejecutar Pruebas

```bash
npm test
```
