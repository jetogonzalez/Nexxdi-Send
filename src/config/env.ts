/**
 * Variables de Entorno - Send App
 * 
 * Configuración centralizada para variables de entorno.
 * Usa import.meta.env en Astro para acceder a las variables.
 */

// Variables públicas (prefijo PUBLIC_)
export const env = {
  // API
  PUBLIC_API_URL: import.meta.env.PUBLIC_API_URL || 'https://api.example.com',
  
  // Firebase
  PUBLIC_FIREBASE_PROJECT_ID: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || '',
  PUBLIC_FIREBASE_API_KEY: import.meta.env.PUBLIC_FIREBASE_API_KEY || '',
  PUBLIC_FIREBASE_AUTH_DOMAIN: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  PUBLIC_FIREBASE_STORAGE_BUCKET: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  PUBLIC_FIREBASE_APP_ID: import.meta.env.PUBLIC_FIREBASE_APP_ID || '',
  PUBLIC_FIREBASE_MEASUREMENT_ID: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID || '',
  
  // App Info
  PUBLIC_APP_NAME: import.meta.env.PUBLIC_APP_NAME || 'Send App',
  PUBLIC_APP_VERSION: import.meta.env.PUBLIC_APP_VERSION || '1.0.0',
  PUBLIC_APP_URL: import.meta.env.PUBLIC_APP_URL || 'https://your-app.web.app',
  
  // Features
  PUBLIC_ENABLE_ANALYTICS: import.meta.env.PUBLIC_ENABLE_ANALYTICS === 'true',
  PUBLIC_ENABLE_DEBUG: import.meta.env.PUBLIC_ENABLE_DEBUG === 'true',
  
  // Environment
  MODE: import.meta.env.MODE || 'development',
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
} as const;

// Helper para verificar si estamos en desarrollo
export const isDev = env.DEV;
export const isProd = env.PROD;

// Helper para obtener la URL base de la API
export const getApiUrl = (endpoint: string = '') => {
  const baseUrl = env.PUBLIC_API_URL.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
};

export default env;
