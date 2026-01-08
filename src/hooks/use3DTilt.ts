import { useState, useEffect, useRef } from 'react';

interface TiltConfig {
  maxTilt?: number; // Máxima rotación en grados (default: 12)
  smoothing?: number; // Factor de suavizado 0-1 (default: 0.15, más bajo = más suave)
  perspective?: number; // Profundidad de perspectiva en píxeles (default: 1000)
  deadZone?: number; // Zona muerta para ignorar micro movimientos (default: 0.5 grados)
  enableShadow?: boolean; // Habilitar sombra dinámica (default: true)
  xOffset?: number; // Offset en grados para el eje X (default: 0)
  yOffset?: number; // Offset en grados para el eje Y (default: 0)
  divideBy?: number; // Dividir valores del giroscopio por este número (default: 1)
  autoRequestPermission?: boolean; // Solicitar permiso automáticamente (default: false)
}

interface TiltState {
  rotateX: number;
  rotateY: number;
  shadowX: number;
  shadowY: number;
}

interface Use3DTiltReturn {
  tiltState: TiltState;
  isSupported: boolean;
  permissionGranted: boolean;
  requestPermission: () => void;
  style: React.CSSProperties;
}

const DEFAULT_CONFIG: Required<TiltConfig> = {
  maxTilt: 12,
  smoothing: 0.15,
  perspective: 1000,
  deadZone: 0.5,
  enableShadow: true,
  xOffset: 0,
  yOffset: 0,
  divideBy: 1,
  autoRequestPermission: false,
};

export function use3DTilt(config: TiltConfig = {}): Use3DTiltReturn {
  const {
    maxTilt = DEFAULT_CONFIG.maxTilt,
    smoothing = DEFAULT_CONFIG.smoothing,
    perspective = DEFAULT_CONFIG.perspective,
    deadZone = DEFAULT_CONFIG.deadZone,
    enableShadow = DEFAULT_CONFIG.enableShadow,
    xOffset = DEFAULT_CONFIG.xOffset,
    yOffset = DEFAULT_CONFIG.yOffset,
    divideBy = DEFAULT_CONFIG.divideBy,
    autoRequestPermission = DEFAULT_CONFIG.autoRequestPermission,
  } = config;

  const [tiltState, setTiltState] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    shadowX: 0,
    shadowY: 0,
  });

  const [isSupported, setIsSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);

  const currentTiltRef = useRef<TiltState>({ rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 0 });
  const animationFrameRef = useRef<number | null>(null);

  // Verificar soporte y permisos
  useEffect(() => {
    const checkSupport = async () => {
      const hasOrientation = typeof DeviceOrientationEvent !== 'undefined';
      const hasMotion = typeof DeviceMotionEvent !== 'undefined';
      
      setIsSupported(hasOrientation || hasMotion);

      // Verificar si iOS requiere permiso
      if (
        hasOrientation &&
        typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      ) {
        setNeedsPermission(true);
        
        // Si autoRequestPermission está habilitado, solicitar permiso automáticamente
        if (autoRequestPermission) {
          try {
            const response = await (DeviceOrientationEvent as any).requestPermission();
            if (response === 'granted') {
              setPermissionGranted(true);
              setNeedsPermission(false);
            } else {
              setPermissionGranted(false);
            }
          } catch (error) {
            console.error('Error al solicitar permiso de movimiento:', error);
            setPermissionGranted(false);
          }
        } else {
          setPermissionGranted(false);
        }
      } else {
        setNeedsPermission(false);
        setPermissionGranted(true);
      }
    };

    checkSupport();
  }, [autoRequestPermission]);

  // Solicitar permiso (debe ser llamado desde un gesto del usuario)
  const requestPermission = () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            setPermissionGranted(true);
            setNeedsPermission(false);
          } else {
            setPermissionGranted(false);
            setNeedsPermission(false);
          }
        })
        .catch(() => {
          setPermissionGranted(false);
          setNeedsPermission(false);
        });
    }
  };

  // Función de suavizado (low-pass filter)
  const smoothValue = (current: number, target: number, factor: number): number => {
    return current + (target - current) * factor;
  };

  // Clamp valor entre -max y max
  const clamp = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, value));
  };

  // Aplicar dead zone
  const applyDeadZone = (value: number, threshold: number): number => {
    return Math.abs(value) < threshold ? 0 : value;
  };

  // Calcular sombra dinámica basada en rotación
  const calculateShadow = (rotateX: number, rotateY: number) => {
    const shadowIntensity = 0.3;
    const shadowBlur = 20;
    const shadowSpread = 5;

    // La sombra se mueve opuesta a la rotación para efecto 3D
    const shadowX = -rotateY * 0.5;
    const shadowY = rotateX * 0.5;

    return {
      x: clamp(shadowX, -shadowBlur, shadowBlur),
      y: clamp(shadowY, -shadowBlur, shadowBlur),
    };
  };

  // Actualizar tilt con interpolación suave
  const updateTilt = (beta: number | null, gamma: number | null) => {
    if (beta === null || gamma === null) return;

    // Dividir valores por divideBy (como en Framer: rotationX / 4, rotationY / 4)
    const normalizedBeta = beta / divideBy;
    const normalizedGamma = gamma / divideBy;

    // Aplicar offsets (como en Framer: X Offset: 45°, Y Offset: 0°)
    const betaWithOffset = normalizedBeta + yOffset;
    const gammaWithOffset = normalizedGamma + xOffset;

    // Normalizar valores de orientación a rotación
    // beta: inclinación adelante/atrás (-180 a 180)
    // gamma: inclinación izquierda/derecha (-90 a 90)
    const targetRotateX = clamp((betaWithOffset / 90) * maxTilt, -maxTilt, maxTilt);
    const targetRotateY = clamp((gammaWithOffset / 90) * maxTilt, -maxTilt, maxTilt);

    // Aplicar dead zone
    const deadZoneRotateX = applyDeadZone(targetRotateX, deadZone);
    const deadZoneRotateY = applyDeadZone(targetRotateY, deadZone);

    // Suavizar con interpolación
    currentTiltRef.current.rotateX = smoothValue(
      currentTiltRef.current.rotateX,
      deadZoneRotateX,
      smoothing
    );
    currentTiltRef.current.rotateY = smoothValue(
      currentTiltRef.current.rotateY,
      deadZoneRotateY,
      smoothing
    );

    // Calcular sombra dinámica
    const shadow = calculateShadow(
      currentTiltRef.current.rotateX,
      currentTiltRef.current.rotateY
    );

    currentTiltRef.current.shadowX = shadow.x;
    currentTiltRef.current.shadowY = shadow.y;

    setTiltState({
      rotateX: currentTiltRef.current.rotateX,
      rotateY: currentTiltRef.current.rotateY,
      shadowX: currentTiltRef.current.shadowX,
      shadowY: currentTiltRef.current.shadowY,
    });
  };

  // Manejar DeviceOrientationEvent
  useEffect(() => {
    if (!isSupported || !permissionGranted) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        updateTilt(e.beta, e.gamma);
      });
    };

    // Manejar DeviceMotionEvent como fallback
    const handleMotion = (e: DeviceMotionEvent) => {
      if (e.rotationRate) {
        const { beta, gamma } = e.rotationRate;
        if (beta !== null && gamma !== null) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }

          animationFrameRef.current = requestAnimationFrame(() => {
            // Convertir rotationRate a grados similares a orientation
            updateTilt(beta * 10, gamma * 10);
          });
        }
      }
    };

    // Intentar usar DeviceOrientationEvent primero
    if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation as EventListener);
    }

    // Fallback a DeviceMotionEvent si está disponible
    if (typeof DeviceMotionEvent !== 'undefined') {
      window.addEventListener('devicemotion', handleMotion as EventListener);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (typeof DeviceOrientationEvent !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation as EventListener);
      }
      if (typeof DeviceMotionEvent !== 'undefined') {
        window.removeEventListener('devicemotion', handleMotion as EventListener);
      }
    };
    }, [isSupported, permissionGranted, maxTilt, smoothing, deadZone, xOffset, yOffset, divideBy]);

  // Generar estilos CSS (sin transform para que pueda combinarse con otros)
  const style: React.CSSProperties = {
    transform: `perspective(${perspective}px) rotateX(${tiltState.rotateX}deg) rotateY(${tiltState.rotateY}deg)`,
    transformStyle: 'preserve-3d',
    willChange: 'transform',
    // No usar transition aquí para evitar conflictos con animaciones CSS
    ...(enableShadow && {
      boxShadow: `${tiltState.shadowX}px ${tiltState.shadowY}px 20px rgba(0, 0, 0, 0.3)`,
    }),
  };

  return {
    tiltState,
    isSupported,
    permissionGranted,
    requestPermission,
    style,
  };
}
