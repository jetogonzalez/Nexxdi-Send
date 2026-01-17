/**
 * Servicio de autenticación biométrica
 * 
 * Maneja la autenticación biométrica usando WebAuthn API
 * En producción, esto se integraría con Capacitor BiometricAuth plugin
 * para acceso nativo a Face ID / Touch ID / BiometricPrompt
 */

export type BiometricAuthResult = 
  | { success: true; token: string }
  | { success: false; error: BiometricAuthError };

export type BiometricAuthError = 
  | 'NOT_AVAILABLE'      // Biometría no disponible
  | 'NOT_ENROLLED'       // No hay biometría configurada
  | 'FAILED'             // Autenticación falló
  | 'CANCELLED'          // Usuario canceló
  | 'LOCKED'             // Bloqueado por intentos (requiere passcode)
  | 'NO_TOKEN'           // No hay token guardado (requiere login con usuario/contraseña)
  | 'UNKNOWN_ERROR';     // Error desconocido

/**
 * Verifica si la biometría está disponible
 */
export async function isBiometricAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  // Verificar WebAuthn API
  if ('credentials' in navigator && window.PublicKeyCredential) {
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }
  
  return false;
}

/**
 * Verifica si hay un token de sesión guardado
 * En producción, esto leería del Keychain/Keystore
 */
export function hasStoredToken(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Simular verificación de token guardado
  // En producción: leer de Keychain (iOS) / Keystore (Android)
  const storedToken = localStorage.getItem('nexxdi_session_token');
  return storedToken !== null && storedToken.length > 0;
}

/**
 * Guarda un token de sesión de forma segura
 * En producción, esto usaría Keychain/Keystore con protección biométrica
 */
export function storeSessionToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  // Simular guardado seguro
  // En producción: guardar en Keychain (iOS) / Keystore (Android) con protección biométrica
  localStorage.setItem('nexxdi_session_token', token);
}

/**
 * Elimina el token de sesión guardado
 */
export function clearSessionToken(): void {
  if (typeof window === 'undefined') return;
  
  // Simular eliminación
  // En producción: eliminar de Keychain/Keystore
  localStorage.removeItem('nexxdi_session_token');
}

/**
 * Obtiene el token de sesión guardado
 * En producción, esto requeriría autenticación biométrica para desbloquear
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Simular lectura
  // En producción: leer de Keychain/Keystore (requiere biometría para desbloquear)
  return localStorage.getItem('nexxdi_session_token');
}

/**
 * Autentica usando biometría del sistema
 * 
 * @param promptMessage Mensaje a mostrar en el prompt nativo
 * @returns Resultado de la autenticación
 */
export async function authenticateWithBiometric(
  promptMessage: string = 'Confirmá tu identidad para ingresar'
): Promise<BiometricAuthResult> {
  // Verificar disponibilidad
  if (!(await isBiometricAvailable())) {
    return { success: false, error: 'NOT_AVAILABLE' };
  }
  
  // Verificar si hay token guardado
  if (!hasStoredToken()) {
    return { success: false, error: 'NO_TOKEN' };
  }
  
  try {
    // Crear challenge aleatorio
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);
    
    // Opciones para solicitar autenticación biométrica
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge: challenge,
      timeout: 60000, // 60 segundos
      userVerification: 'required', // Forzar biometría
      rpId: window.location.hostname,
      allowCredentials: [], // Permitir cualquier credencial
    };
    
    // Intentar autenticación biométrica
    const credential = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    }) as PublicKeyCredential | null;
    
    if (!credential) {
      return { success: false, error: 'CANCELLED' };
    }
    
    // Si llegamos aquí, la biometría fue exitosa
    // Obtener el token guardado (en producción, esto requeriría desbloquear con biometría)
    const token = getStoredToken();
    
    if (!token) {
      return { success: false, error: 'NO_TOKEN' };
    }
    
    // Simular renovación de token usando biometría como "unlock"
    // En producción: llamar al backend para renovar sesión usando el token + biometría
    const renewedToken = await renewSessionToken(token);
    
    return { success: true, token: renewedToken };
    
  } catch (error: any) {
    // Manejar diferentes tipos de errores
    const errorName = error?.name || '';
    const errorMessage = error?.message || '';
    
    if (errorName === 'NotAllowedError' || errorMessage.includes('cancel')) {
      return { success: false, error: 'CANCELLED' };
    }
    
    if (errorName === 'SecurityError' || errorMessage.includes('locked')) {
      return { success: false, error: 'LOCKED' };
    }
    
    if (errorMessage.includes('not enrolled') || errorMessage.includes('no credentials')) {
      return { success: false, error: 'NOT_ENROLLED' };
    }
    
    if (errorMessage.includes('no token') || errorMessage.includes('not found')) {
      return { success: false, error: 'NO_TOKEN' };
    }
    
    // Error genérico
    console.error('Error en autenticación biométrica:', error);
    return { success: false, error: 'FAILED' };
  }
}

/**
 * Renueva el token de sesión usando biometría como "unlock"
 * En producción, esto llamaría al backend
 */
async function renewSessionToken(oldToken: string): Promise<string> {
  // Simular llamada al backend
  // En producción: POST /api/auth/renew-session con el token + verificación biométrica
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simular nuevo token renovado
  const newToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  storeSessionToken(newToken);
  
  return newToken;
}

/**
 * Verifica si la biometría está enrolada/configurada
 */
export async function isBiometricEnrolled(): Promise<boolean> {
  if (!(await isBiometricAvailable())) {
    return false;
  }
  
  // Intentar detectar si hay credenciales guardadas
  // En producción, esto usaría la API nativa del dispositivo
  try {
    // WebAuthn no tiene una forma directa de verificar enrolamiento sin intentar autenticar
    // En producción con Capacitor, usaríamos BiometricAuth.checkBiometry()
    return true; // Asumir que está enrolada si está disponible
  } catch {
    return false;
  }
}
