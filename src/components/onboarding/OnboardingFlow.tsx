import { useState, useEffect, useRef } from 'react';
import { OnboardingButtons } from '../ui/OnboardingButtons';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { use3DTilt } from '../../hooks/use3DTilt';
import { colors, spacing, typography } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface OnboardingStep {
  image: string;
  title: string;
  description: string;
}

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
  const [progress, setProgress] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const AUTO_ADVANCE_DURATION = 10000; // 10 segundos

  // Hook para efecto 3D tilt con phone orientation (gyroscope) - automático
  // Configuración similar a Framer: valores divididos por 4, offsets aplicados
  const {
    tiltState,
    isSupported,
    permissionGranted,
  } = use3DTilt({
    maxTilt: 22.5, // 90° / 4 = 22.5° (similar a dividir por 4 como en la imagen)
    smoothing: 0.15, // Factor de suavizado (más bajo = más suave)
    perspective: 1000, // Profundidad de perspectiva
    deadZone: 0.5, // Zona muerta para evitar micro movimientos
    enableShadow: false, // Sin sombra
    xOffset: 45, // Offset X como en la imagen (45°)
    yOffset: 0, // Offset Y como en la imagen (0°)
    divideBy: 4, // Dividir valores por 4 como en la imagen
    autoRequestPermission: true, // Solicitar permiso automáticamente
  });

  // Aplicar efecto 3D dinámicamente a la imagen del paso activo
  useEffect(() => {
    if (imageRef.current && permissionGranted) {
      const img = imageRef.current;
      img.style.transform = `perspective(1000px) rotateX(${tiltState.rotateX}deg) rotateY(${tiltState.rotateY}deg) scale(1)`;
      img.style.transformStyle = 'preserve-3d';
      img.style.willChange = 'transform';
    }
  }, [tiltState, permissionGranted, currentStep]);

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

    // Actualizar progreso cada 100ms
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / AUTO_ADVANCE_DURATION, 1);
      setProgress(newProgress);
    }, 100);

    // Auto-avance después del tiempo completo
    autoAdvanceRef.current = setTimeout(() => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, AUTO_ADVANCE_DURATION);

    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, [currentStep]);

  // Reset auto-advance cuando cambia manualmente
  const handleStepChange = (newStep: number) => {
    // Determinar dirección del slide (considerando navegación circular)
    const stepDiff = newStep - currentStep;
    const circularDiff = stepDiff > 0 
      ? stepDiff 
      : stepDiff + steps.length; // Ajustar para navegación circular
    
    // Determinar dirección basada en la distancia más corta (circular)
    if (circularDiff <= steps.length / 2) {
      setSlideDirection('left'); // Deslizar hacia la izquierda (siguiente)
    } else {
      setSlideDirection('right'); // Deslizar hacia la derecha (anterior)
    }
    
    setCurrentStep(newStep);
    setProgress(0);
    
    // Limpiar timers existentes
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }
    
    // Resetear dirección después de la animación
    setTimeout(() => {
      setSlideDirection(null);
    }, parseInt(motion.duration.medium.replace('ms', '')));
  };

  // Swipe handlers
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
    const minSwipeDistance = 50;

    // Navegación circular
    if (distance > minSwipeDistance) {
      // Swipe izquierda: avanzar (circular)
      const nextStep = (currentStep + 1) % steps.length;
      handleStepChange(nextStep);
    } else if (distance < -minSwipeDistance) {
      // Swipe derecha: retroceder (circular)
      const prevStep = (currentStep - 1 + steps.length) % steps.length;
      handleStepChange(prevStep);
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const currentStepData = steps[currentStep];

  return (
    <div
      className="w-full flex flex-col"
      style={{ 
        backgroundColor: colors.semantic.background.main,
        minHeight: '100vh',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Contenedor de galería horizontal */}
      <div 
        className="flex-1 flex flex-col"
        style={{ 
          position: 'relative',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          overflow: 'hidden', // Ocultar contenido fuera del viewport
        }}
      >
        {/* Galería horizontal - contenedor de slides */}
        <div
          ref={containerRef}
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: `${steps.length * 100}%`, // Ancho total = número de pasos * 100%
            transform: `translateX(-${currentStep * (100 / steps.length)}%)`, // Desplazar según el paso actual
            transition: slideDirection 
              ? `transform ${motion.duration.medium} ${motion.easing.screenSlide}` 
              : 'none', // Solo transición cuando hay cambio de dirección
            willChange: 'transform',
            WebkitOverflowScrolling: 'touch',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {steps.map((stepData, index) => {
            const isActive = index === currentStep;
            
            return (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{
                  width: `${100 / steps.length}%`, // Cada slide ocupa 1/n del ancho total
                  paddingLeft: spacing[5],
                  paddingRight: spacing[5],
                      paddingTop: '20vh', // Posición proporcional ajustada
                  paddingBottom: spacing[4],
                  flex: '1 1 auto',
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  touchAction: 'pan-x',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  flexShrink: 0,
                }}
              >
                {/* Imagen con círculo blanco detrás */}
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: spacing.imageCircle,
                    height: spacing.imageCircle,
                    marginBottom: spacing[0],
                  }}
                >
                  {/* Círculo blanco con opacidad 40% - PRIMERO en entrar */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: colors.semantic.background.imageCircle,
                      zIndex: 0,
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'scale(1)' : 'scale(0.95)',
                      animation: isActive ? `fadeInScale ${motion.duration.slow} ${motion.easing.smoothOut} forwards` : 'none',
                      animationDelay: '0ms',
                    }}
                  />
                  {/* Imagen - SEGUNDO en entrar con efecto 3D (gyroscope) */}
                  <img
                    ref={isActive ? imageRef : null}
                    src={`/img/onboarding/${stepData.image}.png`}
                    srcSet={`
                      /img/onboarding/${stepData.image}.png 1x,
                      /img/onboarding/${stepData.image}@2x.png 2x,
                      /img/onboarding/${stepData.image}@3x.png 3x
                    `}
                    alt={stepData.title}
                    className="relative z-10"
                    style={{
                      width: spacing.imageSize,
                      height: spacing.imageSize,
                      objectFit: 'contain',
                      imageRendering: '-webkit-optimize-contrast',
                      WebkitImageRendering: '-webkit-optimize-contrast',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      opacity: isActive ? 1 : 0,
                      transform: isActive 
                        ? (permissionGranted 
                          ? `perspective(1000px) rotateX(${tiltState.rotateX}deg) rotateY(${tiltState.rotateY}deg) scale(1)`
                          : 'scale(1)')
                        : 'scale(0.96)',
                      animation: isActive ? `fadeInScale ${motion.duration.slow} ${motion.easing.smoothOut} forwards` : 'none',
                      animationDelay: '200ms',
                      transformStyle: 'preserve-3d',
                      willChange: isActive ? 'transform' : 'auto',
                      transition: isActive && permissionGranted ? 'none' : `transform ${motion.duration.medium} ${motion.easing.screenSlide}`,
                    }}
                    onAnimationEnd={() => {
                      // Después de la animación inicial, aplicar el efecto 3D si está habilitado
                      if (imageRef.current && permissionGranted && isActive) {
                        imageRef.current.style.transform = `perspective(1000px) rotateX(${tiltState.rotateX}deg) rotateY(${tiltState.rotateY}deg) scale(1)`;
                        imageRef.current.style.transformStyle = 'preserve-3d';
                        imageRef.current.style.willChange = 'transform';
                      }
                    }}
                  />
                </div>

                {/* Título centrado - TERCERO en entrar */}
                <div
                  className="text-center w-full"
                  style={{
                    marginTop: spacing[4],
                    marginBottom: spacing[3],
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'scale(1)' : 'scale(0.97)',
                    animation: isActive ? `fadeInScale ${motion.duration.slow} ${motion.easing.smoothOut} forwards` : 'none',
                    animationDelay: '400ms',
                  }}
                >
                  <h1
                    className="whitespace-pre-line"
                    style={{
                      fontSize: typography.fontSize['3xl'],
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.semantic.text.primary,
                      lineHeight: '1.15',
                      fontFamily: typography.fontFamily.sans.join(', '),
                      marginBottom: spacing[0],
                    }}
                  >
                    {stepData.title}
                  </h1>
                </div>

                {/* Descripción - CUARTO en entrar */}
                <div 
                  className="text-center w-full"
                  style={{
                    marginBottom: spacing[0],
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'scale(1)' : 'scale(0.97)',
                    animation: isActive ? `fadeInScale ${motion.duration.slow} ${motion.easing.smoothOut} forwards` : 'none',
                    animationDelay: '600ms',
                  }}
                >
                  <p
                    style={{
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.normal,
                      color: colors.semantic.text.secondary,
                      lineHeight: typography.lineHeight.normal,
                      fontFamily: typography.fontFamily.sans.join(', '),
                      width: '100%',
                      display: 'block',
                    }}
                  >
                    {stepData.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicador de progreso */}
      <div 
        style={{ 
          paddingTop: spacing[0.5], 
          paddingBottom: '3rem', // 3rem (48px)
          position: 'relative',
          zIndex: 1001, // Asegurar que esté por encima de la barra de botones
          backgroundColor: 'transparent', // Sin color de fondo
          flexShrink: 0,
          pointerEvents: 'auto', // Asegurar que los clicks funcionen
        }}
      >
        <ProgressIndicator 
          currentIndex={currentStep} 
          totalPages={steps.length}
          progress={progress}
          onDotClick={(index) => handleStepChange(index)}
        />
      </div>

      {/* Espaciador para evitar que el contenido se corte con la barra fija */}
      <div style={{ 
        height: 'calc(180px + env(safe-area-inset-bottom))', 
        flexShrink: 0,
        backgroundColor: 'transparent',
      }} />

      {/* Botones - Liquid Glass Button Bar (fixed) */}
      <OnboardingButtons 
        onCreateAccount={() => console.log('Crear cuenta')}
        onLogin={() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }}
      />
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
