import { useState, useEffect, useRef } from 'react';
import { ApplePagination } from './ApplePagination';
import { colors } from '../../config/design-tokens';
import { motion } from '../../lib/motion';

interface OnboardingStep {
  image: string;
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    image: '/img/onboarding/onboarding-card.png',
    title: 'Tarjeta virtual\nsin costo',
    description: 'Compra en línea o úsala desde tu wallet',
  },
  {
    image: '/img/onboarding/onboarding-send.png',
    title: 'Envía dinero a\notros países',
    description: 'Rápido, seguro y desde tu celular',
  },
  {
    image: '/img/onboarding/onboarding-flash.png',
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

  // Auto-avance cada 5 segundos (más tiempo)
  useEffect(() => {
    autoAdvanceRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % steps.length;
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 600);
        return next;
      });
    }, 5000); // 5 segundos en lugar de 4

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
    }, 5000); // 5 segundos
  };

  // Swipe handlers mejorados
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentStep < steps.length - 1) {
      handleStepChange(currentStep + 1);
    }
    if (isRightSwipe && currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
    
    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div
      className="h-screen w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: colors.semantic.background.main }}
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
            paddingTop: '3rem', // 48px
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
              {/* Imagen sobre el círculo con transición más fluida */}
              <img
                src={steps[currentStep].image}
                alt={steps[currentStep].title}
                key={`image-${currentStep}`}
                className="relative z-10 object-contain"
                style={{
                  width: '16rem', // 256px
                  height: '16rem', // 256px
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning 
                    ? 'scale(0.85) translateY(15px)' 
                    : 'scale(1) translateY(0)',
                  transition: motion.transitions.fadeScale,
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
                marginBottom: '2rem', // 32px - espacio antes del paginador
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
                style={{
                  fontSize: '1rem', // 16pt
                  fontWeight: 400, // regular
                  color: colors.semantic.text.secondary,
                  lineHeight: '1.5',
                  fontFamily: 'Manrope, sans-serif',
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

      {/* Paginación estilo Apple - 2rem desde el último texto */}
      <div style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
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
