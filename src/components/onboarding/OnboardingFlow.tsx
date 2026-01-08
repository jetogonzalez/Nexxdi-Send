import { useState, useEffect, useRef } from 'react';
import { ApplePagination } from './ApplePagination';
import { colors } from '../../config/design-tokens';
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

  // Swipe handlers mejorados con mejor detección
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart(touch.clientX);
    setTouchEnd(0);
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
      className="h-screen w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: '#F0EFF8' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Grid de 4 columnas con gap de 16px (1rem) y margin left/right de 20px (1.25rem) */}
      <div className="flex-1 overflow-y-auto">
        <div 
          className="grid grid-cols-4 gap-4"
          style={{
            marginLeft: '1.25rem', // 20px
            marginRight: '1.25rem', // 20px
            paddingTop: '4rem', // 64px - más espacio arriba
            paddingBottom: '2rem', // 32px
            gap: '1rem', // 16px
          }}
        >
          {/* Columna 1 - vacía para espaciado */}
          <div className="col-span-1" />
          
          {/* Columna 2-3 - Contenido centrado */}
          <div className="col-span-2 flex flex-col items-center">
            {/* Imagen con círculo blanco detrás */}
            <div
              className="relative flex items-center justify-center mb-8"
              key={`image-container-${currentStep}`}
              style={{
                width: '17.5rem', // 280px
                height: '17.5rem', // 280px
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
                    ? 'scale(0.9) rotate(-5deg)' 
                    : 'scale(1) rotate(0deg)',
                  transition: motion.transitions.fadeScale,
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
                  width: '16rem', // 256px
                  height: '16rem', // 256px
                  objectFit: 'contain',
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning 
                    ? 'scale(0.85) translateY(15px)' 
                    : 'scale(1) translateY(0)',
                  transition: motion.transitions.fadeScale,
                  imageRendering: '-webkit-optimize-contrast', // Mejor calidad en iOS
                  WebkitImageRendering: '-webkit-optimize-contrast',
                }}
              />
            </div>

            {/* Título y descripción con transiciones más fluidas y diversas */}
            <div
              className="text-center"
              key={`text-${currentStep}`}
              style={{
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning 
                  ? 'translateY(25px) scale(0.95)' 
                  : 'translateY(0) scale(1)',
                transition: motion.transitions.slideUp,
                marginBottom: '0.1875rem', // 3px - distancia del texto al paginador
              }}
            >
              <h1
                className="mb-4 whitespace-pre-line"
                style={{
                  fontSize: '1.625rem', // 26pt
                  fontWeight: 600, // semibold
                  color: colors.semantic.text.primary,
                  lineHeight: '1.5',
                  fontFamily: 'Manrope, sans-serif',
                }}
              >
                {steps[currentStep].title}
              </h1>
              <p
                className="whitespace-nowrap"
                style={{
                  fontSize: '1rem', // 16pt
                  fontWeight: 400, // regular
                  color: colors.semantic.text.secondary,
                  lineHeight: '1.5',
                  fontFamily: 'Manrope, sans-serif',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {steps[currentStep].description}
              </p>
            </div>
          </div>

          {/* Columna 4 - vacía para espaciado */}
          <div className="col-span-1" />
        </div>
      </div>

      {/* Paginación estilo Apple - 3rem (48px) desde el paginador a los botones */}
      <div style={{ paddingTop: '0.1875rem', paddingBottom: '3rem' }}>
        <ApplePagination currentIndex={currentStep} totalPages={steps.length} />
      </div>

      {/* Botones full rounded */}
      <div 
        className="space-y-3"
        style={{
          paddingLeft: '1.25rem', // 20px
          paddingRight: '1.25rem', // 20px
          paddingBottom: '2rem', // 32px
        }}
      >
        <button
          className="w-full py-4 font-bold text-base text-white"
          style={{
            backgroundColor: colors.semantic.button.primary,
            borderRadius: '9999px', // full rounded
            transition: `background-color ${motion.duration.fast} ${motion.easing.smoothOut}`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.semantic.button.primaryHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.semantic.button.primary)}
        >
          Crear cuenta
        </button>
        <button
          className="w-full py-4 font-bold text-base"
          style={{
            backgroundColor: colors.semantic.button.secondary,
            color: colors.semantic.text.primary,
            borderRadius: '9999px', // full rounded
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
