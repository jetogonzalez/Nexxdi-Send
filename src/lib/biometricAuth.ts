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
  | 'NO_CREDENTIAL'       // No hay credencial biométrica guardada (requiere activar Face ID primero)
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
 * Verifica si hay credencial biométrica guardada
 * En producción, esto verificaría en Keychain/Keystore si existe una credencial protegida
 */
export function hasBiometricCredential(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Simular verificación de credencial biométrica guardada
  // En producción: verificar en Keychain (iOS) / Keystore (Android) si existe credencial protegida
  const hasCredential = localStorage.getItem('nexxdi_biometric_credential') !== null;
  return hasCredential;
}

/**
 * Guarda credencial biométrica protegida (userId + biometricKey/refreshToken)
 * En producción, esto usaría Keychain/Keystore con protección biométrica
 * iOS: Keychain con kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly + biometryCurrentSet
 * Android: Keystore con setUserAuthenticationRequired(true)
 */
export function storeBiometricCredential(userId: string, biometricKey: string): void {
  if (typeof window === 'undefined') return;
  
  // Simular guardado seguro de credencial biométrica
  // En producción: guardar en Keychain (iOS) / Keystore (Android) con protección biométrica
  // Esto NO es un token de sesión inseguro, es una credencial protegida por biometría
  localStorage.setItem('nexxdi_biometric_user_id', userId);
  localStorage.setItem('nexxdi_biometric_credential', biometricKey);
}

/**
 * Elimina la credencial biométrica guardada
 */
export function clearBiometricCredential(): void {
  if (typeof window === 'undefined') return;
  
  // Simular eliminación
  // En producción: eliminar de Keychain/Keystore
  localStorage.removeItem('nexxdi_biometric_user_id');
  localStorage.removeItem('nexxdi_biometric_credential');
}

/**
 * Obtiene el userId de la credencial biométrica guardada
 * En producción, esto requeriría autenticación biométrica para desbloquear
 */
export function getBiometricUserId(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Simular lectura
  // En producción: leer de Keychain/Keystore (requiere biometría para desbloquear)
  return localStorage.getItem('nexxdi_biometric_user_id');
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
  
  // Verificar si hay credencial biométrica guardada
  if (!hasBiometricCredential()) {
    return { success: false, error: 'NO_CREDENTIAL' };
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
    // En producción: desbloquear credencial del Keychain/Keystore usando biometría
    // y usar esa credencial para obtener token de sesión del backend
    const userId = getBiometricUserId();
    
    if (!userId) {
      return { success: false, error: 'NO_CREDENTIAL' };
    }
    
    // Simular obtención de token de sesión usando la credencial biométrica desbloqueada
    // En producción: llamar al backend con la credencial biométrica para obtener token de sesión
    const sessionToken = await getSessionTokenFromBiometricCredential(userId);
    
    return { success: true, token: sessionToken };
    
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
    
    if (errorMessage.includes('no credential') || errorMessage.includes('not found')) {
      return { success: false, error: 'NO_CREDENTIAL' };
    }
    
    // Error genérico
    console.error('Error en autenticación biométrica:', error);
    return { success: false, error: 'FAILED' };
  }
}

/**
 * Obtiene token de sesión usando credencial biométrica desbloqueada
 * En producción, esto llamaría al backend con la credencial biométrica
 */
async function getSessionTokenFromBiometricCredential(userId: string): Promise<string> {
  // Simular llamada al backend
  // En producción: POST /api/auth/session-from-biometric con userId + credencial biométrica
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simular token de sesión obtenido
  const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return sessionToken;
}

/**
 * Crea y guarda credencial biométrica después del login con usuario/contraseña
 * En producción, esto registraría una credencial WebAuthn o guardaría en Keychain/Keystore
 */
export async function createBiometricCredential(userId: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  if (!(await isBiometricAvailable())) {
    return false;
  }
  
  try {
    // Simular creación de credencial biométrica
    // En producción: 
    // - iOS: Guardar en Keychain con protección biométrica
    // - Android: Guardar en Keystore con setUserAuthenticationRequired(true)
    // - Web: Registrar credencial WebAuthn
    
    // Generar biometricKey/refreshToken
    const biometricKey = `biometric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Guardar credencial protegida
    storeBiometricCredential(userId, biometricKey);
    
    return true;
  } catch (error) {
    console.error('Error creando credencial biométrica:', error);
    return false;
  }
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
