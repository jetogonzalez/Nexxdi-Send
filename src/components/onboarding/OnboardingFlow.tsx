import { useState, useEffect, useRef } from 'react';
import { ApplePagination } from './ApplePagination';

interface OnboardingStep {
  image: string;
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    image: '/img/onboarding/onboarding-card.png',
    title: 'Tarjeta virtual sin costo',
    description: 'Compra en línea o úsala desde tu wallet',
  },
  {
    image: '/img/onboarding/onboarding-send.png',
    title: 'Envía dinero a otros países',
    description: 'Rápido, seguro y desde tu celular',
  },
  {
    image: '/img/onboarding/onboarding-flash.png',
    title: 'Transferencias al instante',
    description: 'Entre usuarios, rápido y sin comisiones',
  },
];

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-avance cada 4 segundos
  useEffect(() => {
    autoAdvanceRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % steps.length;
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 300);
        return next;
      });
    }, 4000);

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
    setTimeout(() => setIsTransitioning(false), 300);
    
    if (autoAdvanceRef.current) {
      clearInterval(autoAdvanceRef.current);
    }
    autoAdvanceRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % steps.length;
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 300);
        return next;
      });
    }, 4000);
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentStep < steps.length - 1) {
      handleStepChange(currentStep + 1);
    }
    if (isRightSwipe && currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#F0EFF8' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Contenido principal con scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          {/* Imagen */}
          <div className="flex justify-center mb-8 mt-12">
            <div
              className="relative"
              key={`image-${currentStep}`}
              style={{
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
                transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <img
                src={steps[currentStep].image}
                alt={steps[currentStep].title}
                className="w-64 h-64 object-contain"
                style={{
                  maxWidth: '256px',
                  maxHeight: '256px',
                }}
              />
            </div>
          </div>

          {/* Título y descripción */}
          <div
            className="text-center mb-8 px-4"
            key={`text-${currentStep}`}
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
              transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <h1
              className="mb-4"
              style={{
                fontSize: '1.625rem', // 26pt
                fontWeight: 600, // semibold
                color: '#101828',
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
                color: '#6b7280',
                lineHeight: '1.5',
                fontFamily: 'Manrope, sans-serif',
              }}
            >
              {steps[currentStep].description}
            </p>
          </div>
        </div>
      </div>

      {/* Paginación estilo Apple */}
      <div className="pb-4">
        <ApplePagination currentIndex={currentStep} totalPages={steps.length} />
      </div>

      {/* Botones */}
      <div className="px-4 pb-8 space-y-3">
        <button
          className="w-full py-4 rounded-xl font-bold text-base text-white"
          style={{
            backgroundColor: '#101828',
            transition: 'opacity 200ms ease-in-out',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Crear cuenta
        </button>
        <button
          className="w-full py-4 rounded-xl font-bold text-base"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            color: '#101828',
            transition: 'opacity 200ms ease-in-out',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Ya tengo cuenta
        </button>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
