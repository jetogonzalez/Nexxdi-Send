"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { borderRadius, colors, spacing, typography } from '../../config/design-tokens';
import { BottomSheet } from '../ui/BottomSheet';

interface Section {
  id: string;
  name: string;
  enabled: boolean;
}

interface PersonalizeHomeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  sections?: Section[];
  onSave?: (sections: Section[]) => void;
}

// Secciones por defecto
const defaultSections: Section[] = [
  { id: 'productos', name: 'Productos', enabled: true },
  { id: 'widget-cambio', name: 'Widget de cambio', enabled: true },
  { id: 'envios-frecuentes', name: 'Envíos frecuentes', enabled: true },
  { id: 'ultimos-movimientos', name: 'Últimos movimientos', enabled: true },
];

export function PersonalizeHomeSheet({ isOpen, onClose, sections: initialSections = defaultSections, onSave }: PersonalizeHomeSheetProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [hasChanges, setHasChanges] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const listRef = useRef<HTMLDivElement>(null);
  
  // Referencia para guardar initialSections y comparar cambios
  const initialSectionsRef = useRef<Section[]>(initialSections);
  
  // Refs para touch drag
  const draggedIndexRef = useRef<number | null>(null);
  const sectionsRef = useRef<Section[]>(sections);

  // Keep refs in sync
  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  useEffect(() => {
    draggedIndexRef.current = draggedIndex;
  }, [draggedIndex]);

  // Función para asignar ref por ID de sección
  const setItemRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
    } else {
      itemRefs.current.delete(id);
    }
  }, []);

  // Resetear cuando se abre/cierra - usar las secciones pasadas como prop
  useEffect(() => {
    if (isOpen) {
      // Guardar la referencia de las secciones iniciales
      initialSectionsRef.current = initialSections;
      setSections([...initialSections]);
      setHasChanges(false);
      setDraggedIndex(null);
    }
  }, [isOpen, initialSections]);

  // Toggle de sección
  const toggleSection = (id: string) => {
    setSections((prev) => {
      const newSections = prev.map((section) =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      );
      // Ordenar: habilitadas arriba, deshabilitadas abajo
      const enabled = newSections.filter((s) => s.enabled);
      const disabled = newSections.filter((s) => !s.enabled);
      const sorted = [...enabled, ...disabled];
      
      // Verificar si hay cambios comparando con la referencia inicial
      const hasChanged = JSON.stringify(sorted) !== JSON.stringify(initialSectionsRef.current);
      setHasChanges(hasChanged);
      
      return sorted;
    });
  };

  // Reordenar secciones (usando setState funcional para evitar stale closures)
  const reorderSections = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return toIndex;
    
    setSections((prev) => {
      const newSections = [...prev];
      const draggedItem = newSections[fromIndex];
      newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, draggedItem);
      
      // Usar la referencia para comparar
      const hasChanged = JSON.stringify(newSections) !== JSON.stringify(initialSectionsRef.current);
      setHasChanges(hasChanged);
      
      return newSections;
    });
    
    return toIndex;
  }, []);

  // ============ TOUCH HANDLERS (Mobile) - Native event listeners ============
  const handleTouchStart = useCallback((index: number) => {
    setDraggedIndex(index);
    draggedIndexRef.current = index;
  }, []);

  // Native touch event handlers
  useEffect(() => {
    const list = listRef.current;
    if (!list || !isOpen) return;

    const onTouchMove = (e: TouchEvent) => {
      const currentDraggedIndex = draggedIndexRef.current;
      if (currentDraggedIndex === null) return;
      
      e.preventDefault();
      
      const touchY = e.touches[0].clientY;
      const currentSections = sectionsRef.current;
      
      // Encontrar sobre qué elemento estamos
      for (let i = 0; i < currentSections.length; i++) {
        if (i === currentDraggedIndex) continue;
        
        const item = itemRefs.current.get(currentSections[i].id);
        if (item) {
          const rect = item.getBoundingClientRect();
          const itemCenterY = rect.top + rect.height / 2;
          
          if (touchY < itemCenterY && currentDraggedIndex > i) {
            // Mover hacia arriba
            const newIndex = reorderSections(currentDraggedIndex, i);
            setDraggedIndex(newIndex);
            draggedIndexRef.current = newIndex;
            break;
          } else if (touchY > itemCenterY && currentDraggedIndex < i) {
            // Mover hacia abajo
            const newIndex = reorderSections(currentDraggedIndex, i);
            setDraggedIndex(newIndex);
            draggedIndexRef.current = newIndex;
            break;
          }
        }
      }
    };

    const onTouchEnd = () => {
      setDraggedIndex(null);
      draggedIndexRef.current = null;
    };

    list.addEventListener('touchmove', onTouchMove, { passive: false });
    list.addEventListener('touchend', onTouchEnd);
    list.addEventListener('touchcancel', onTouchEnd);

    return () => {
      list.removeEventListener('touchmove', onTouchMove);
      list.removeEventListener('touchend', onTouchEnd);
      list.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isOpen, reorderSections]);

  // ============ MOUSE/POINTER HANDLERS (Desktop) ============
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex === null || draggedIndex === index) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    
    if (e.clientY < midY && draggedIndex > index) {
      reorderSections(draggedIndex, index);
      setDraggedIndex(index);
    } else if (e.clientY > midY && draggedIndex < index) {
      reorderSections(draggedIndex, index);
      setDraggedIndex(index);
    }
  }, [draggedIndex, reorderSections]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  // Manejar guardar - solo guarda si hay cambios
  const handleSave = useCallback(() => {
    if (hasChanges && onSave) {
      onSave(sections);
      onClose();
    }
  }, [onSave, hasChanges, sections, onClose]);

  // Manejar clic en el botón check
  const handleCheckClick = useCallback(() => {
    if (hasChanges) {
      handleSave();
    }
    // Si no hay cambios, no hace nada (no cierra)
  }, [hasChanges, handleSave]);

  // Icono de cerrar
  const closeIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke={colors.semantic.text.primary}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Icono de check (activo/inactivo) - solo el contenido, el BottomSheetHeader lo envuelve en botón
  const checkIcon = (
    <div
      style={{
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.full,
        backgroundColor: hasChanges ? colors.semantic.button.primary : 'transparent',
        transition: 'background-color 0.2s ease',
        margin: '-10px', // Compensar el padding del botón padre para cubrir completamente
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 6L9 17L4 12"
          stroke={hasChanges ? colors.semantic.background.white : colors.semantic.text.tertiary}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Personaliza esta sección"
      leftIcon={closeIcon}
      rightIcon={checkIcon}
      onLeftIconClick={onClose}
      onRightIconClick={handleCheckClick}
      maxHeight={90}
      showGraber={true}
    >
      <div
        ref={listRef}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Descripción */}
        <p
          onClick={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          style={{
            fontFamily: typography.fontFamily.sans.join(', '),
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal,
            color: colors.semantic.text.secondary,
            lineHeight: '24px',
            margin: 0,
            marginTop: spacing[4],
            marginBottom: spacing[4],
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          Elige qué secciones quieres ver en tu Home, ocúltalas o cámbiales el orden según tu preferencia.
        </p>
        
        {sections.map((section, index) => (
          <div
            key={section.id}
            ref={(el) => setItemRef(section.id, el)}
            draggable={false}
            onDragOver={(e) => handleDragOver(e, index)}
            style={{
              display: 'flex',
              alignItems: 'center',
              opacity: draggedIndex === index ? 0.5 : 1,
              backgroundColor: draggedIndex === index ? colors.semantic.background.main : 'transparent',
              transition: 'opacity 0.15s ease, background-color 0.15s ease',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              touchAction: 'none',
            }}
          >
            {/* Checkbox - sin divider debajo */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSection(section.id);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSection(section.id);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              style={{
                width: '44px', // Área táctil más grande
                height: '44px',
                padding: '10px',
                borderRadius: borderRadius.full,
                border: 'none',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginRight: spacing[2],
                marginLeft: `-10px`,
                flexShrink: 0,
                alignSelf: 'center',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: borderRadius.full,
                  border: `2px solid ${section.enabled ? colors.primary.main : colors.semantic.border.medium}`,
                  backgroundColor: section.enabled ? colors.primary.main : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
              {section.enabled && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.6667 3.5L5.25 9.91667L2.33334 7"
                      stroke={colors.semantic.background.white}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </button>

            {/* Contenedor del texto y drag handle con divider */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                paddingTop: spacing[4],
                paddingBottom: spacing[4],
                borderBottom: index < sections.length - 1 ? `1px solid ${colors.semantic.border.light}` : 'none',
              }}
            >
              {/* Nombre de la sección */}
              <span
                style={{
                  flex: 1,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.normal,
                  color: section.enabled ? colors.semantic.text.primary : colors.semantic.text.tertiary,
                  textAlign: 'left',
                  pointerEvents: 'none',
                }}
              >
                {section.name}
              </span>

              {/* Icono de arrastrar - touch target */}
              <div
                data-drag-handle
                draggable={true}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleTouchStart(index);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  marginLeft: spacing[4],
                  cursor: draggedIndex === index ? 'grabbing' : 'grab',
                  flexShrink: 0,
                  padding: spacing[3],
                  marginRight: `-${spacing[3]}`,
                  touchAction: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <div style={{ width: '20px', height: '2px', backgroundColor: colors.semantic.text.tertiary, borderRadius: '1px', pointerEvents: 'none' }} />
                <div style={{ width: '20px', height: '2px', backgroundColor: colors.semantic.text.tertiary, borderRadius: '1px', pointerEvents: 'none' }} />
                <div style={{ width: '20px', height: '2px', backgroundColor: colors.semantic.text.tertiary, borderRadius: '1px', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
}
