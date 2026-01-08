import { useState, useEffect, useRef } from 'react';
import { ApplePagination } from './ApplePagination';
import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface OnboardingStep {
  image: string; // Nombre base de la imagen (sin extensión ni @2x/@3x)
  title: string;
  description: string;
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
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-avance cada 6 segundos (más tiempo)
  useEffect(() => {
    autoAdvanceRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % steps.length;
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 600);
        return next;
      });
    }, 6000); // 6 segundos

    return () => {
      if (autoAdvanceRef.current) {
        clearInterval(autoAdvanceRef.current);
      }
    };
  }, []);

  // Reset auto-advance cuando cambia manualmente
  const handleStepChange = (newStep: number) => {
    setIsTransitioning(true);
    setCurrentStep(newStep);
    setTimeout(() => setIsTransitioning(false), 600);
    
    if (autoAdvanceRef.current) {
      clearInterval(autoAdvanceRef.current);
    }
    autoAdvanceRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % steps.length;
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 600);
        return next;
      });
    }, 6000); // 6 segundos
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Contenido sin grid - layout simple */}
      <div className="flex-1 overflow-y-auto">
        <div 
          className="flex flex-col items-center"
          style={{
            paddingLeft: spacing[5], // 1.25rem = 20px
            paddingRight: spacing[5], // 1.25rem = 20px
            paddingTop: '12rem', // 12rem = 192px
            paddingBottom: spacing[8], // 2rem = 32px
          }}
        >
          {/* Imagen con círculo blanco detrás */}
          <div
            className="relative flex items-center justify-center"
            key={`image-container-${currentStep}`}
            style={{
              width: spacing.imageCircle, // 17.5rem = 280px
              height: spacing.imageCircle, // 17.5rem = 280px
              marginBottom: spacing[0], // 0 - sin margen inferior
            }}
          >
            {/* Círculo blanco con opacidad 40% - usando tokens */}
            <div
              className="absolute rounded-full"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: colors.semantic.background.imageCircle,
                zIndex: 0,
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning 
                  ? 'scale(0.92) rotate(-3deg)' 
                  : 'scale(1) rotate(0deg)',
                transition: `opacity ${motion.duration.slow} ${motion.easing.smoothOut}, transform ${motion.duration.slow} ${motion.easing.smoothOut}`,
              }}
            />
            {/* Imagen sobre el círculo con transición más fluida - usando mejor calidad */}
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
                  : 'scale(1) translateY(0)',
                transition: `opacity ${motion.duration.slow} ${motion.easing.smoothOut}, transform ${motion.duration.slow} ${motion.easing.smoothOut}`,
                imageRendering: '-webkit-optimize-contrast', // Mejor calidad en iOS
                WebkitImageRendering: '-webkit-optimize-contrast',
              }}
            />
          </div>

          {/* Título centrado */}
          <div
            className="text-center w-full"
            key={`title-${currentStep}`}
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning 
                ? 'translateY(20px) scale(0.92)' 
                : 'translateY(0) scale(1)',
              transition: `opacity ${motion.duration.slow} ${motion.easing.smoothOut}, transform ${motion.duration.slow} ${motion.easing.smoothOut}`,
              marginTop: spacing[4], // 1rem = 16px - distancia del círculo al título
              marginBottom: spacing[0], // 0 - sin margen inferior
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

          {/* Descripción ocupando todo el ancho */}
          <div 
            className="text-center w-full"
            key={`description-${currentStep}`}
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning 
                ? 'translateY(20px) scale(0.92)' 
                : 'translateY(0) scale(1)',
              transition: `opacity ${motion.duration.slow} ${motion.easing.smoothOut}, transform ${motion.duration.slow} ${motion.easing.smoothOut}`,
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

      {/* Paginación estilo Apple - 3rem (48px) desde el paginador a los botones */}
      <div style={{ paddingTop: spacing[0.5], paddingBottom: spacing[12] }}>
        <ApplePagination 
          currentIndex={currentStep} 
          totalPages={steps.length}
          onDotClick={(index) => handleStepChange(index)}
        />
      </div>

      {/* Botones full rounded */}
      <div 
        style={{
          paddingLeft: spacing[5], // 1.25rem = 20px
          paddingRight: spacing[5], // 1.25rem = 20px
          paddingBottom: spacing[8], // 2rem = 32px
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[4], // 1rem = 16px - distancia entre botones
        }}
      >
        <button
          className="w-full text-white"
          style={{
            backgroundColor: colors.semantic.button.primary,
            borderRadius: borderRadius.full, // full rounded
            paddingTop: spacing[4], // 16px
            paddingBottom: spacing[4], // 16px
            fontSize: typography.fontSize.base, // 16pt
            fontWeight: typography.fontWeight.bold, // bold
            fontFamily: typography.fontFamily.sans.join(', '),
            transition: `background-color ${motion.duration.fast} ${motion.easing.smoothOut}`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.semantic.button.primaryHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.semantic.button.primary)}
        >
          Crear cuenta
        </button>
        <button
          className="w-full"
          style={{
            backgroundColor: colors.semantic.button.secondary,
            color: colors.semantic.text.primary,
            borderRadius: borderRadius.full, // full rounded
            paddingTop: spacing[4], // 16px
            paddingBottom: spacing[4], // 16px
            fontSize: typography.fontSize.base, // 16pt
            fontWeight: typography.fontWeight.bold, // bold
            fontFamily: typography.fontFamily.sans.join(', '),
            transition: `background-color ${motion.duration.fast} ${motion.easing.smoothOut}`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.semantic.button.secondaryHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.semantic.button.secondary)}
        >
          Ya tengo cuenta
        </button>
      </div>
    </div>
  );
}
