/**
 * Helper global para manejar iconos de navegación
 * Detecta automáticamente si usar SVG locales o componentes React
 */

import { TarjetaIcon } from './icons/TarjetaIcon';
import { MasIcon } from './icons/MasIcon';

type IconComponent = React.ComponentType<{ isActive?: boolean; size?: number }>;

export interface TabIconConfig {
  id: string;
  label: string;
  // Si tiene iconActive/iconInactive, usa SVG
  iconActive?: string;
  iconInactive?: string;
  // Si tiene icon, usa componente React
  icon?: IconComponent;
}

/**
 * Obtiene la configuración de iconos para un tab
 * Prioriza SVG/PNG locales, luego componentes React
 */
export function getTabIconConfig(tabId: string, label: string): TabIconConfig {
  const basePath = '/img/icons/button-bar';
  
  // Lista de tabs que tienen SVG/PNG disponibles
  const svgTabs = ['home', 'wallet', 'cash', 'tarjeta'];
  
  if (svgTabs.includes(tabId)) {
    // Para cash, usar PNG para activo si está disponible, SVG para inactivo
    if (tabId === 'cash') {
      return {
        id: tabId,
        label,
        iconActive: `${basePath}/icon-${tabId}-active.png`,
        iconInactive: `${basePath}/icon-${tabId}-inactive.svg`,
      };
    }
    
    // Para tarjeta, usar el nombre 'card' en los archivos
    if (tabId === 'tarjeta') {
      return {
        id: tabId,
        label,
        iconActive: `${basePath}/icon-card-active.svg`,
        iconInactive: `${basePath}/icon-card-inactive.svg`,
      };
    }
    
    // Para otros tabs, usar SVG
    return {
      id: tabId,
      label,
      iconActive: `${basePath}/icon-${tabId}-active.svg`,
      iconInactive: `${basePath}/icon-${tabId}-inactive.svg`,
    };
  }
  
  // Mapeo de componentes React para tabs sin SVG
  const componentMap: Record<string, IconComponent> = {
    tarjeta: TarjetaIcon,
    mas: MasIcon,
  };
  
  const IconComponent = componentMap[tabId];
  
  if (IconComponent) {
    return {
      id: tabId,
      label,
      icon: IconComponent,
    };
  }
  
  // Fallback: retornar sin icono
  return {
    id: tabId,
    label,
  };
}
