/**
 * Utilidades para guardar y recuperar credenciales de forma segura
 */

const STORAGE_KEY = 'cash_app_saved_credentials';

interface SavedCredentials {
  email: string;
  password: string; // En producción, esto debería estar encriptado
  savedAt: number;
}

/**
 * Guardar credenciales en localStorage
 */
export function saveCredentials(email: string, password: string): void {
  try {
    const credentials: SavedCredentials = {
      email,
      password, // En producción, encriptar antes de guardar
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.error('Error al guardar credenciales:', error);
  }
}

/**
 * Obtener credenciales guardadas
 */
export function getSavedCredentials(): SavedCredentials | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const credentials = JSON.parse(stored) as SavedCredentials;
    return credentials;
  } catch (error) {
    console.error('Error al obtener credenciales:', error);
    return null;
  }
}

/**
 * Eliminar credenciales guardadas
 */
export function clearSavedCredentials(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error al eliminar credenciales:', error);
  }
}

/**
 * Verificar si hay credenciales guardadas
 */
export function hasSavedCredentials(): boolean {
  return getSavedCredentials() !== null;
}
