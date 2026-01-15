import type { ReactNode } from 'react';

interface SectionTransitionProps {
  children: ReactNode;
  activeTab: string;
  previousTab: string;
}

/**
 * Componente sin transiciones - muestra el contenido directamente
 */
export function SectionTransition({ children }: SectionTransitionProps) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
      }}
    >
      {children}
    </div>
  );
}
