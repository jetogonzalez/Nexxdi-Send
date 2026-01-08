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
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const imageRef = useRef<HTMLImageElement | null>(null);
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

  // Aplicar efecto 3D dinámicamente a la imagen después de la animación inicial
  useEffect(() => {
    if (imageRef.current && permissionGranted) {
      const img = imageRef.current;
      img.style.transform = `perspective(1000px) rotateX(${tiltState.rotateX}deg) rotateY(${tiltState.rotateY}deg) scale(1)`;
      img.style.transformStyle = 'preserve-3d';
      img.style.willChange = 'transform';
    }
  }, [tiltState, permissionGranted]);

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
    setCurrentStep(newStep);
    setProgress(0);
    
    // Limpiar timers existentes
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }
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

    if (distance > minSwipeDistance && currentStep < steps.length - 1) {
      handleStepChange(currentStep + 1);
    } else if (distance < -minSwipeDistance && currentStep > 0) {
      handleStepChange(currentStep - 1);
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
      {/* Contenido */}
      <div 
        className="flex-1 flex flex-col"
        style={{ 
          position: 'relative',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <div 
          className="flex flex-col items-center"
          style={{
            paddingLeft: spacing[5],
            paddingRight: spacing[5],
            paddingTop: spacing[8],
            paddingBottom: spacing[4],
            flex: '1 1 auto',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            touchAction: 'pan-x',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            width: '100%',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
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
              key={`circle-${currentStep}`}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: colors.semantic.background.imageCircle,
                zIndex: 0,
                opacity: 0,
                transform: 'scale(0.95)',
                animation: `fadeInScale ${motion.duration.slow} ${motion.easing.smoothOut} forwards`,
                animationDelay: '0ms',
              }}
            />
            {/* Imagen - SEGUNDO en entrar con efecto 3D (gyroscope) */}
            <img
              ref={imageRef}
              src={`/img/onboarding/${currentStepData.image}.png`}
              srcSet={`
                /img/onboarding/${currentStepData.image}.png 1x,
                /img/onboarding/${currentStepData.image}@2x.png 2x,
                /img/onboarding/${currentStepData.image}@3x.png 3x
              `}
              alt={currentStepData.title}
              className="relative z-10"
              key={`image-${currentStep}`}
              style={{
                width: spacing.imageSize,
                height: spacing.imageSize,
                objectFit: 'contain',
                imageRendering: '-webkit-optimize-contrast',
                WebkitImageRendering: '-webkit-optimize-contrast',
                opacity: 0,
                transform: 'scale(0.96)',
                animation: `fadeInScale ${motion.duration.slow} ${motion.easing.smoothOut} forwards`,
                animationDelay: '200ms',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              onAnimationEnd={() => {
                // Después de la animación inicial, aplicar el efecto 3D si está habilitado
                if (imageRef.current && permissionGranted) {
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
            key={`title-${currentStep}`}
            style={{
              marginTop: spacing[4],
              marginBottom: spacing[3],
              opacity: 0,
              transform: 'scale(0.97)',
              animation: `fadeInScale ${motion.duration.slow} ${motion.easing.smoothOut} forwards`,
              animationDelay: '400ms',
            }}
          >
            <h1
              className="whitespace-pre-line"
              style={{
                fontSize: typography.fontSize['3xl'],
                fontWeight: typography.fontWeight.semibold,
                color: colors.semantic.text.primary,
                lineHeight: typography.lineHeight.normal,
                fontFamily: typography.fontFamily.sans.join(', '),
                marginBottom: spacing[0],
              }}
            >
              {currentStepData.title}
            </h1>
          </div>

          {/* Descripción - CUARTO en entrar */}
          <div 
            className="text-center w-full"
            key={`description-${currentStep}`}
            style={{
              marginBottom: spacing[0],
              opacity: 0,
              transform: 'scale(0.97)',
              animation: `fadeInScale ${motion.duration.slow} ${motion.easing.smoothOut} forwards`,
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
              {currentStepData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Indicador de progreso */}
      <div 
        style={{ 
          paddingTop: spacing[0.5], 
          paddingBottom: '4rem',
          position: 'relative',
          zIndex: 10,
          backgroundColor: colors.semantic.background.main,
          flexShrink: 0,
        }}
      >
        <ProgressIndicator 
          currentIndex={currentStep} 
          totalPages={steps.length}
          progress={progress}
          onDotClick={(index) => handleStepChange(index)}
        />
      </div>

      {/* Botones */}
      <div style={{ flexShrink: 0, position: 'relative' }}>
        <OnboardingButtons 
          onCreateAccount={() => console.log('Crear cuenta')}
          onLogin={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }}
        />
      </div>
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
