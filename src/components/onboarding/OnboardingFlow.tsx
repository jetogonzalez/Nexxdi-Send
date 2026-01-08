import { useState, useEffect, useRef } from 'react';
import { OnboardingButtons } from '../ui/OnboardingButtons';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { colors, spacing, typography } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface OnboardingStep {
  image: string; // Nombre base de la imagen (sin extensión ni @2x/@3x)
  title: string;
  description: string;
}

// Tipos para el efecto parallax
interface ParallaxOffset {
  x: number;
  y: number;
}

// srcSet manejará automáticamente la selección de la mejor calidad

const steps: OnboardingStep[] = [
  {
    image: 'onboarding-card',
    title: 'Tarjeta virtual\nsin costo',
    description: 'Compra en línea o úsala desde tu wallet',
  },
  {
    image: 'onboarding-send',
    title: 'Envía dinero a\notros países',
    description: 'Rápido, seguro y desde tu celular',
  },
  {
    image: 'onboarding-flash',
    title: 'Transferencias\nal instante',
    description: 'Entre usuarios, rápido y sin comisiones',
  },
];

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0); // 0 a 1 para la animación de progreso
  const [parallaxOffset, setParallaxOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const parallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const AUTO_ADVANCE_DURATION = 10000; // 10 segundos - más tiempo entre cada paso
  const PARALLAX_INTENSITY = 15; // Intensidad del efecto parallax en píxeles

  // Auto-avance con animación de progreso
  useEffect(() => {
    // Limpiar timers anteriores
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }

    // Reiniciar progreso
    startTimeRef.current = Date.now();
    setProgress(0);

    // Actualizar progreso cada 100ms para animación más lenta y natural
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / AUTO_ADVANCE_DURATION, 1);
      setProgress(newProgress);
    }, 100); // Actualizar cada 100ms para movimiento más lento y natural

    // Auto-avance después del tiempo completo
    autoAdvanceRef.current = setTimeout(() => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
      setCurrentStep((prev) => {
        const next = (prev + 1) % steps.length;
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 600);
        return next;
      });
    }, AUTO_ADVANCE_DURATION);

    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [currentStep]); // Reiniciar cuando cambia el paso

  // Efecto parallax con sensores del dispositivo (gyroscope/accelerometer)
  useEffect(() => {
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma: inclinación izquierda/derecha (-90 a 90)
        // beta: inclinación adelante/atrás (-180 a 180)
        const targetX = (e.gamma / 90) * PARALLAX_INTENSITY;
        const targetY = (e.beta / 90) * PARALLAX_INTENSITY;
        
        // Suavizar el movimiento con interpolación
        parallaxRef.current.x += (targetX - parallaxRef.current.x) * 0.1;
        parallaxRef.current.y += (targetY - parallaxRef.current.y) * 0.1;
        
        setParallaxOffset({
          x: parallaxRef.current.x,
          y: parallaxRef.current.y,
        });
      }
    };

    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      if (e.accelerationIncludingGravity) {
        const { x, y } = e.accelerationIncludingGravity;
        if (x !== null && y !== null) {
          // Normalizar y aplicar intensidad
          const targetX = (x / 9.8) * PARALLAX_INTENSITY;
          const targetY = (y / 9.8) * PARALLAX_INTENSITY;
          
          // Suavizar el movimiento
          parallaxRef.current.x += (targetX - parallaxRef.current.x) * 0.1;
          parallaxRef.current.y += (targetY - parallaxRef.current.y) * 0.1;
          
          setParallaxOffset({
            x: parallaxRef.current.x,
            y: parallaxRef.current.y,
          });
        }
      }
    };

    // Intentar usar DeviceOrientationEvent primero (iOS)
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // iOS 13+ requiere permiso
      (DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation as EventListener);
          }
        })
        .catch(() => {
          // Fallback a DeviceMotionEvent
          window.addEventListener('devicemotion', handleDeviceMotion as EventListener);
        });
    } else {
      // Android y otros navegadores
      window.addEventListener('deviceorientation', handleDeviceOrientation as EventListener);
      window.addEventListener('devicemotion', handleDeviceMotion as EventListener);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation as EventListener);
      window.removeEventListener('devicemotion', handleDeviceMotion as EventListener);
    };
  }, []);

  // Reset auto-advance cuando cambia manualmente
  const handleStepChange = (newStep: number) => {
    setIsTransitioning(true);
    setCurrentStep(newStep);
    setProgress(0); // Resetear progreso
    setTimeout(() => setIsTransitioning(false), 600);
    
    // Limpiar timers existentes
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }
    
    // Reiniciar auto-advance (se reiniciará automáticamente por el useEffect)
  };

  // Swipe handlers mejorados con mejor detección y más natural
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart(touch.clientX);
    setTouchEnd(touch.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd(touch.clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setTouchStart(0);
      setTouchEnd(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 30; // Reducido para hacerlo más sensible y natural
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentStep < steps.length - 1) {
      handleStepChange(currentStep + 1);
    } else if (isRightSwipe && currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
    
    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div
      className="w-full flex flex-col min-h-screen"
      style={{ backgroundColor: colors.semantic.background.main }}
    >
      {/* Contenido arrastrable como carrusel - solo esta sección */}
      <div 
        className="flex-1 overflow-hidden"
        style={{ position: 'relative' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex flex-col items-center h-full"
          style={{
            paddingLeft: spacing[5], // 1.25rem = 20px
            paddingRight: spacing[5], // 1.25rem = 20px
            paddingTop: '12rem', // 12rem = 192px
            paddingBottom: spacing[8], // 2rem = 32px
            overflowY: 'auto',
          }}
        >
              {/* Imagen con círculo blanco detrás - solo la imagen tiene parallax */}
              <div
                className="relative flex items-center justify-center"
                key={`image-container-${currentStep}`}
                style={{
                  width: spacing.imageCircle, // 17.5rem = 280px
                  height: spacing.imageCircle, // 17.5rem = 280px
                  marginBottom: spacing[0], // 0 - sin margen inferior
                }}
              >
                {/* Círculo blanco con opacidad 40% - PRIMERO en entrar - SIN parallax */}
                <div
                  className="absolute rounded-full"
                  key={`circle-${currentStep}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: colors.semantic.background.imageCircle,
                    zIndex: 0,
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning 
                      ? 'scale(0.85)' 
                      : 'scale(1)',
                    transition: `opacity ${motion.duration.base} ${motion.easing.smoothOut}, transform ${motion.duration.base} ${motion.easing.smoothOut}`,
                    transitionDelay: isTransitioning ? '0ms' : '0ms', // Primero sin delay
                  }}
                />
                {/* Imagen sobre el círculo - SEGUNDO en entrar con poco delay - SOLO esta tiene parallax */}
                <img
                  src={`/img/onboarding/${steps[currentStep].image}.png`}
                  srcSet={`
                    /img/onboarding/${steps[currentStep].image}.png 1x,
                    /img/onboarding/${steps[currentStep].image}@2x.png 2x,
                    /img/onboarding/${steps[currentStep].image}@3x.png 3x
                  `}
                  alt={steps[currentStep].title}
                  key={`image-${currentStep}`}
                  className="relative z-10"
                  style={{
                    width: spacing.imageSize, // 16rem = 256px
                    height: spacing.imageSize, // 16rem = 256px
                    objectFit: 'contain',
                    opacity: isTransitioning ? 0 : 1,
                    transform: isTransitioning 
                      ? 'scale(0.88) translateY(10px)' 
                      : `scale(1) translateY(0) translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`, // SOLO la imagen tiene parallax
                    transition: isTransitioning 
                      ? `opacity ${motion.duration.base} ${motion.easing.smoothOut}, transform ${motion.duration.base} ${motion.easing.smoothOut}` 
                      : 'transform 0.1s ease-out', // Transición suave para parallax
                    transitionDelay: isTransitioning ? '0ms' : '100ms', // Muy poco delay después del círculo
                    imageRendering: '-webkit-optimize-contrast', // Mejor calidad en iOS
                    WebkitImageRendering: '-webkit-optimize-contrast',
                  }}
                />
              </div>

              {/* Título centrado - TERCERO en entrar después de la imagen */}
              <div
                className="text-center w-full"
                key={`title-${currentStep}`}
                style={{
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning 
                    ? 'translateY(20px) scale(0.92)' 
                    : 'translateY(0) scale(1)',
                  transition: `opacity ${motion.duration.base} ${motion.easing.smoothOut}, transform ${motion.duration.base} ${motion.easing.smoothOut}`,
                  transitionDelay: isTransitioning ? '0ms' : '200ms', // Delay después de la imagen
                  marginTop: spacing[4], // 1rem = 16px - distancia del círculo al título
                  marginBottom: spacing[3], // 0.75rem = 12px - espaciado entre título y párrafo
                }}
              >
                <h1
                  className="whitespace-pre-line"
                  style={{
                    fontSize: typography.fontSize['3xl'], // 26pt
                    fontWeight: typography.fontWeight.semibold, // semibold
                    color: colors.semantic.text.primary,
                    lineHeight: typography.lineHeight.normal, // 1.5
                    fontFamily: typography.fontFamily.sans.join(', '),
                    marginBottom: spacing[0], // 0 - sin padding/margin bottom
                  }}
                >
                  {steps[currentStep].title}
                </h1>
              </div>

              {/* Descripción ocupando todo el ancho - CUARTO en entrar después del título */}
              <div 
                className="text-center w-full"
                key={`description-${currentStep}`}
                style={{
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning 
                    ? 'translateY(20px) scale(0.92)' 
                    : 'translateY(0) scale(1)',
                  transition: `opacity ${motion.duration.base} ${motion.easing.smoothOut}, transform ${motion.duration.base} ${motion.easing.smoothOut}`,
                  transitionDelay: isTransitioning ? '0ms' : '300ms', // Delay después del título
                  marginBottom: spacing[0], // 0 - sin padding/margin bottom
                }}
              >
                <p
                  style={{
                    fontSize: typography.fontSize.base, // 16pt
                    fontWeight: typography.fontWeight.normal, // regular
                    color: colors.semantic.text.secondary,
                    lineHeight: typography.lineHeight.normal, // 1.5
                    fontFamily: typography.fontFamily.sans.join(', '),
                    width: '100%',
                    display: 'block',
                    // Sin restricciones - se ve todo el texto completo
                  }}
                >
                  {steps[currentStep].description}
                </p>
              </div>
        </div>
      </div>

      {/* Indicador de progreso con animación de llenado - solo este */}
      <div 
        style={{ 
          paddingTop: spacing[0.5], 
          paddingBottom: spacing[12],
          position: 'relative',
          zIndex: 10,
          backgroundColor: colors.semantic.background.main,
        }}
      >
        <ProgressIndicator 
          currentIndex={currentStep} 
          totalPages={steps.length}
          progress={progress}
          onDotClick={(index) => handleStepChange(index)}
        />
      </div>

      {/* Botones - Componente separado */}
      <OnboardingButtons 
        onCreateAccount={() => console.log('Crear cuenta')}
        onLogin={() => console.log('Ya tengo cuenta')}
      />
    </div>
  );
}
