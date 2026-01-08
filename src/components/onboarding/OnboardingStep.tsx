import { useState } from 'react';

interface OnboardingStepProps {
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  showNext?: boolean;
  showPrevious?: boolean;
  showSkip?: boolean;
}

export function OnboardingStep({
  step,
  totalSteps,
  title,
  description,
  children,
  onNext,
  onPrevious,
  onSkip,
  showNext = true,
  showPrevious = true,
  showSkip = false,
}: OnboardingStepProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Progress indicator */}
      <div className="w-full bg-gray-200 h-1">
        <div
          className="bg-primary h-1 transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-4">{title}</h1>
          {description && (
            <p className="text-gray-600 text-center mb-8">{description}</p>
          )}
          <div className="mb-8">{children}</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center p-6 border-t">
        {showSkip && onSkip && (
          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700"
          >
            Saltar
          </button>
        )}
        <div className="flex gap-4 ml-auto">
          {showPrevious && onPrevious && step > 1 && (
            <button
              onClick={onPrevious}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Anterior
            </button>
          )}
          {showNext && onNext && (
            <button
              onClick={onNext}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              {step === totalSteps ? 'Comenzar' : 'Siguiente'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
