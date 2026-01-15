import React, { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { spacing, colors } from '../../config/design-tokens';

interface CardDeckProps {
  children: ReactNode | ReactNode[];
  onCardChange?: (index: number) => void;
}

/**
 * Componente que apila las tarjetas con drag vertical (arriba/abajo)
 * Basado en el CodePen proporcionado con efectos de rubber band y parallax
 */
export function CardDeck({ children, onCardChange }: CardDeckProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  // Normalizar children a array
  const cards = Array.isArray(children)
    ? children.filter(Boolean)
    : children
    ? [children]
    : [];

  // Constantes del CodePen
  const PEEK = 56; // Distancia entre tarjetas: 56px
  const GAP_TO_BACK = 8;
  const BACK_Y = -PEEK * 2; // -112
  const FRONT_UP_LIMIT = BACK_Y + GAP_TO_BACK; // -104

  // UP (hacia arriba) - límites ajustados
  const MID_DOWN_MAX = 64;
  const UP_RUBBER = 0.22;
  const UP_MAX_LIMIT = -PEEK; // Límite máximo hacia arriba: -56px (una tarjeta)

  // DOWN (hacia abajo) - límites ajustados para movimiento más natural
  const DOWN_SOFT_START = 50; // Inicio más temprano para transición más suave
  const DOWN_RUBBER = 0.35; // Aumentado para movimiento más fluido y natural
  const DOWN_PARALLAX_MID = 0.12;
  const DOWN_PARALLAX_BACK = 0.06;
  
  // Función para calcular el límite inferior dinámico basado en el contenido siguiente
  const getDownMaxLimit = () => {
    if (!deckRef.current) return 100; // Límite por defecto
    
    const deckRect = deckRef.current.getBoundingClientRect();
    const deckBottom = deckRect.bottom;
    
    // Buscar el siguiente elemento hermano
    const nextSibling = deckRef.current.nextElementSibling;
    if (!nextSibling) return 100; // Si no hay siguiente elemento, usar límite por defecto
    
    const nextRect = nextSibling.getBoundingClientRect();
    const nextTop = nextRect.top;
    
    // Calcular la distancia disponible antes de sobreponerse
    const availableSpace = nextTop - deckBottom;
    
    // Retornar el límite máximo (máximo 100px, pero no más de lo disponible)
    return Math.min(100, Math.max(0, availableSpace - 10)); // 10px de margen de seguridad
  };

  // Tiempos de commit
  const DOWN_COMMIT_MS = 190;
  const DOWN_FALLBACK_MS = 230;
  const DOWN_OUT_Y = 54;

  const VELOCITY_COMMIT = 900;
  const THRESHOLD_RATIO = 0.26;

  // Estado del drag
  const [order, setOrder] = useState<number[]>(() => cards.map((_, i) => i));
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const dyRawRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTRef = useRef(0);
  const velocityYRef = useRef(0);
  const dyVisualRef = useRef(0);
  const rafPendingRef = useRef(false);
  const pendingYRef = useRef(0);

  // Funciones helper
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const softClampUp = (y: number, limit: number) => {
    // Aplicar límite máximo hacia arriba
    const clampedY = Math.max(y, UP_MAX_LIMIT);
    if (clampedY >= limit) return clampedY;
    const over = clampedY - limit;
    return limit + over * UP_RUBBER;
  };

  const softDown = (y: number) => {
    // Calcular límite máximo dinámico basado en el contenido siguiente
    const dynamicMaxLimit = getDownMaxLimit();
    // Aplicar límite máximo hacia abajo
    const clampedY = Math.min(y, dynamicMaxLimit);
    
    // Movimiento más natural: aplicar resistencia progresiva desde el inicio
    if (clampedY <= DOWN_SOFT_START) {
      // Movimiento libre hasta DOWN_SOFT_START
      return clampedY;
    }
    
    // Aplicar efecto rubber band de forma más suave y natural
    const over = clampedY - DOWN_SOFT_START;
    const resistance = DOWN_SOFT_START + over * DOWN_RUBBER;
    
    // Asegurar que no exceda el límite dinámico
    return Math.min(resistance, dynamicMaxLimit);
  };

  const threshold = () => {
    if (!deckRef.current) return 0;
    return deckRef.current.getBoundingClientRect().height * THRESHOLD_RATIO;
  };

  const applyZ = (cardElements: HTMLDivElement[]) => {
    if (cardElements[order[0]]) cardElements[order[0]].style.zIndex = '30';
    if (cardElements[order[1]]) cardElements[order[1]].style.zIndex = '20';
    if (cardElements[order[2]]) cardElements[order[2]].style.zIndex = '10';
  };

  const layout = (animate: boolean = true) => {
    if (!deckRef.current) return;
    const cardElements = Array.from(deckRef.current.children) as HTMLDivElement[];
    if (cardElements.length === 0) return;

    const t = animate ? 'transform 260ms cubic-bezier(.2,.9,.2,1)' : 'none';
    cardElements.forEach((el) => {
      el.style.transition = t;
    });

    // Tarjeta del frente (completamente visible) - order[0]
    if (cardElements[order[0]]) {
      const front = cardElements[order[0]];
      front.style.position = 'relative';
      front.style.top = 'auto';
      front.style.left = 'auto';
      front.style.right = 'auto';
      front.style.bottom = 'auto';
      front.style.transform = 'translate3d(0,0,0)';
      front.style.zIndex = '30';
    }

    // Segunda tarjeta (parcialmente visible detrás) - order[1]
    if (cardElements[order[1]]) {
      const mid = cardElements[order[1]];
      mid.style.position = 'absolute';
      mid.style.top = '0';
      mid.style.left = '0';
      mid.style.right = '0';
      mid.style.bottom = 'auto';
      mid.style.transform = `translate3d(0,${-PEEK}px,0)`;
      mid.style.zIndex = '20';
    }

    // Tercera tarjeta (más atrás) - order[2]
    if (cardElements[order[2]]) {
      const back = cardElements[order[2]];
      back.style.position = 'absolute';
      back.style.top = '0';
      back.style.left = '0';
      back.style.right = '0';
      back.style.bottom = 'auto';
      back.style.transform = `translate3d(0,${BACK_Y}px,0)`;
      back.style.zIndex = '10';
    }

    applyZ(cardElements);
  };

  const dragTransformCore = (y: number) => {
    if (!deckRef.current) return;
    const cardElements = Array.from(deckRef.current.children) as HTMLDivElement[];
    if (cardElements.length === 0) return;

    const front = cardElements[order[0]];
    const mid = cardElements[order[1]];
    const back = cardElements[order[2]];

    if (!front) return;

    front.style.transition = 'none';
    if (mid) mid.style.transition = 'none';
    if (back) back.style.transition = 'none';

    if (y > 0) {
      // DOWN: rubber + parallax
      const yd = softDown(y);
      front.style.transform = `translate3d(0,${yd}px,0)`;

      if (mid) {
        const midY = -PEEK + yd * DOWN_PARALLAX_MID;
        mid.style.transform = `translate3d(0,${midY}px,0)`;
      }
      if (back) {
        const backY = BACK_Y + yd * DOWN_PARALLAX_BACK;
        back.style.transform = `translate3d(0,${backY}px,0)`;
      }

      applyZ(cardElements);
      return;
    }

    // UP: rubber
    dyVisualRef.current = softClampUp(y, FRONT_UP_LIMIT);
    front.style.transform = `translate3d(0,${dyVisualRef.current}px,0)`;

    const p = clamp(Math.abs(dyVisualRef.current) / Math.abs(FRONT_UP_LIMIT), 0, 1);
    if (mid) {
      const midY = -PEEK + MID_DOWN_MAX * p;
      mid.style.transform = `translate3d(0,${midY}px,0)`;
    }
    if (back) {
      back.style.transform = `translate3d(0,${BACK_Y}px,0)`;
    }

    applyZ(cardElements);
  };

  const dragTransform = (y: number) => {
    pendingYRef.current = y;
    if (rafPendingRef.current) return;
    rafPendingRef.current = true;
    requestAnimationFrame(() => {
      rafPendingRef.current = false;
      dragTransformCore(pendingYRef.current);
    });
  };

  const commitUp = () => {
    const newOrder = [...order];
    const [A, B, C] = newOrder;
    const updatedOrder = [B, A, C];
    setOrder(updatedOrder);
    onCardChange?.(updatedOrder[0]);
  };

  const commitDown = () => {
    const newOrder = [...order];
    const first = newOrder.shift()!;
    newOrder.push(first);
    setOrder(newOrder);
    onCardChange?.(newOrder[0]);
  };

  const animateCommit = (up: boolean, dyRaw: number) => {
    if (!deckRef.current) return;
    const cardElements = Array.from(deckRef.current.children) as HTMLDivElement[];
    if (cardElements.length === 0) return;

    const front = cardElements[order[0]];
    if (!front) return;

    let finished = false;

    const finalize = () => {
      if (finished) return;
      finished = true;
      if (up) {
        commitUp();
      } else {
        commitDown();
      }
      front.style.transition = 'none';
      front.style.transform = '';
      requestAnimationFrame(() => layout(true));
    };

    if (!up) {
      // DOWN con animación más natural y suave
      front.style.zIndex = '5';
      const start = softDown(dyRaw);

      front.style.transition = 'none';
      front.style.transform = `translate3d(0,${start}px,0)`;

      requestAnimationFrame(() => {
        // Curva de animación más natural para movimiento hacia abajo
        front.style.transition = `transform ${DOWN_COMMIT_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        front.style.transform = `translate3d(0,${DOWN_OUT_Y}px,0) scale(0.985)`;
      });

      front.addEventListener('transitionend', finalize, { once: true });
      setTimeout(finalize, DOWN_FALLBACK_MS);
      return;
    }

    // UP
    front.style.zIndex = '15';
    const targetMid = -PEEK;
    const overshoot = targetMid - 8;

    front.style.transition = 'none';
    front.style.transform = `translate3d(0,${dyVisualRef.current}px,0)`;

    requestAnimationFrame(() => {
      front.style.transition = 'transform 220ms cubic-bezier(.2,.9,.2,1)';
      front.style.transform = `translate3d(0,${overshoot}px,0) scale(0.99)`;
    });

    front.addEventListener(
      'transitionend',
      () => {
        front.style.transition = 'transform 160ms cubic-bezier(.2,.9,.2,1)';
        front.style.transform = `translate3d(0,${targetMid}px,0)`;
        front.addEventListener('transitionend', finalize, { once: true });
        setTimeout(finalize, 220);
      },
      { once: true }
    );
  };

  // Prevenir scroll del body durante drag
  const preventBodyScroll = (prevent: boolean) => {
    if (prevent) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  };

  // Event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!deckRef.current) return;
    const cardElements = Array.from(deckRef.current.children) as HTMLDivElement[];
    if (cardElements.length === 0) return;
    
    // Buscar la tarjeta del frente y verificar si el click fue en ella
    const front = cardElements[order[0]];
    if (!front) return;
    
    // Verificar si el click fue en la tarjeta del frente o en sus hijos
    const target = e.target as HTMLElement;
    // Excluir botones interactivos
    const isButton = target.tagName === 'BUTTON' || target.closest('button');
    if (isButton) return;
    
    const clickedOnFront = front.contains(target) || front === target;
    
    if (!clickedOnFront) return;

    // Prevenir scroll del body
    preventBodyScroll(true);

    draggingRef.current = true;
    startYRef.current = e.clientY;
    lastYRef.current = e.clientY;
    lastTRef.current = performance.now();
    velocityYRef.current = 0;

    if (deckRef.current.setPointerCapture) {
      deckRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;

    // Prevenir scroll durante el drag
    e.preventDefault();

    dyRawRef.current = e.clientY - startYRef.current;

    const now = performance.now();
    const dt = now - lastTRef.current;
    if (dt > 0) {
      velocityYRef.current = ((e.clientY - lastYRef.current) / dt) * 1000;
      lastYRef.current = e.clientY;
      lastTRef.current = now;
    }

    dragTransform(dyRawRef.current);
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    
    // Restaurar scroll del body
    preventBodyScroll(false);
    
    draggingRef.current = false;

    const yCommit = dyRawRef.current < 0 ? dyVisualRef.current : softDown(dyRawRef.current);
    const commit =
      Math.abs(yCommit) > threshold() || Math.abs(velocityYRef.current) > VELOCITY_COMMIT;

    if (!commit) {
      layout(true);
      return;
    }
    animateCommit(dyRawRef.current < 0, dyRawRef.current);
  };

  const handlePointerCancel = () => {
    // Restaurar scroll del body
    preventBodyScroll(false);
    
    draggingRef.current = false;
    layout(true);
  };

  // Event listeners globales para touch en móviles
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      
      // Prevenir scroll durante el drag
      e.preventDefault();
      
      const dy = e.clientY - startYRef.current;
      dyRawRef.current = dy;

      const now = performance.now();
      const dt = now - lastTRef.current;
      if (dt > 0) {
        velocityYRef.current = ((e.clientY - lastYRef.current) / dt) * 1000;
        lastYRef.current = e.clientY;
        lastTRef.current = now;
      }

      dragTransform(dy);
    };

    const handleGlobalPointerUp = (e: PointerEvent) => {
      if (draggingRef.current) {
        preventBodyScroll(false);
        draggingRef.current = false;

        const yCommit = dyRawRef.current < 0 ? dyVisualRef.current : softDown(dyRawRef.current);
        const commit =
          Math.abs(yCommit) > threshold() || Math.abs(velocityYRef.current) > VELOCITY_COMMIT;

        if (!commit) {
          layout(true);
          return;
        }
        animateCommit(dyRawRef.current < 0, dyRawRef.current);
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (draggingRef.current) {
        e.preventDefault(); // Prevenir scroll durante drag
        e.stopPropagation(); // Evitar que el evento se propague
        
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          const dy = touch.clientY - startYRef.current;
          dyRawRef.current = dy;

          const now = performance.now();
          const dt = now - lastTRef.current;
          if (dt > 0) {
            velocityYRef.current = ((touch.clientY - lastYRef.current) / dt) * 1000;
            lastYRef.current = touch.clientY;
            lastTRef.current = now;
          }

          dragTransform(dy);
        }
      }
    };

    const handleGlobalTouchStart = (e: TouchEvent) => {
      if (!deckRef.current) return;
      const cardElements = Array.from(deckRef.current.children) as HTMLDivElement[];
      if (cardElements.length === 0) return;
      
      const front = cardElements[order[0]];
      if (!front) return;
      
      const target = e.target as HTMLElement;
      // Verificar si el touch fue en la tarjeta del frente o en sus hijos
      // Excluir botones interactivos
      const isButton = target.tagName === 'BUTTON' || target.closest('button');
      if (isButton) return;
      
      const clickedOnFront = front.contains(target) || front === target;
      
      if (clickedOnFront && e.touches.length === 1) {
        e.preventDefault(); // Prevenir scroll inmediatamente
        preventBodyScroll(true);
        draggingRef.current = true;
        const touch = e.touches[0];
        startYRef.current = touch.clientY;
        lastYRef.current = touch.clientY;
        lastTRef.current = performance.now();
        velocityYRef.current = 0;
      }
    };

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      if (draggingRef.current) {
        e.preventDefault();
        preventBodyScroll(false);
        draggingRef.current = false;

        const yCommit = dyRawRef.current < 0 ? dyVisualRef.current : softDown(dyRawRef.current);
        const commit =
          Math.abs(yCommit) > threshold() || Math.abs(velocityYRef.current) > VELOCITY_COMMIT;

        if (!commit) {
          layout(true);
          return;
        }
        animateCommit(dyRawRef.current < 0, dyRawRef.current);
      }
    };

    const handleGlobalTouchCancel = () => {
      if (draggingRef.current) {
        preventBodyScroll(false);
        draggingRef.current = false;
        layout(true);
      }
    };

    // Usar capture phase para interceptar eventos antes de que lleguen a otros elementos
    document.addEventListener('pointermove', handleGlobalPointerMove, { passive: false, capture: true });
    document.addEventListener('pointerup', handleGlobalPointerUp, { capture: true });
    document.addEventListener('pointercancel', handleGlobalPointerUp, { capture: true });
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false, capture: true });
    document.addEventListener('touchstart', handleGlobalTouchStart, { passive: false, capture: true });
    document.addEventListener('touchend', handleGlobalTouchEnd, { passive: false, capture: true });
    document.addEventListener('touchcancel', handleGlobalTouchCancel, { passive: false, capture: true });

    return () => {
      document.removeEventListener('pointermove', handleGlobalPointerMove, { capture: true } as any);
      document.removeEventListener('pointerup', handleGlobalPointerUp, { capture: true } as any);
      document.removeEventListener('pointercancel', handleGlobalPointerUp, { capture: true } as any);
      document.removeEventListener('touchmove', handleGlobalTouchMove, { capture: true } as any);
      document.removeEventListener('touchstart', handleGlobalTouchStart, { capture: true } as any);
      document.removeEventListener('touchend', handleGlobalTouchEnd, { capture: true } as any);
      document.removeEventListener('touchcancel', handleGlobalTouchCancel, { capture: true } as any);
      // Asegurar que el scroll se restaure al desmontar
      preventBodyScroll(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  // Layout inicial cuando se monta el componente - sin animación
  useEffect(() => {
    if (cards.length > 0 && deckRef.current) {
      // Layout inicial sin animación para posicionar correctamente desde el inicio
      layout(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Layout cuando cambia el orden
  useEffect(() => {
    if (cards.length > 0 && deckRef.current && order.length === cards.length) {
      requestAnimationFrame(() => {
        layout(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  // Calcular el espacio necesario arriba para las tarjetas de atrás
  const topOffset = (cards.length - 1) * PEEK;

  return (
    <div
      ref={deckRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '136px', // Altura fija igual a una tarjeta
        marginTop: `${topOffset}px`, // Margen superior para compensar las tarjetas de atrás
        marginBottom: spacing[5], // 20px de distancia entre elementos
        overflow: 'visible',
        touchAction: 'none', // Deshabilitar gestos táctiles por defecto para permitir drag
        WebkitTouchCallout: 'none', // Prevenir menú contextual en iOS
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {cards.map((card, index) => {
        const cardOrder = order.indexOf(index);
        const isFront = cardOrder === 0;
        const isMiddle = cardOrder === 1;
        const isBack = cardOrder === 2;

        // Determinar si la tarjeta anterior es CurrencyCard y es clara/blanca
        // Para aplicar la lógica: si hay dos blancas seguidas, la primera sin overlay, la segunda con 6%
        let isPreviousCardLight = false;
        let isNextCardLight = false;
        
        // Si está en segunda posición (isMiddle), verificar si la primera es CurrencyCard clara
        if (isMiddle && cards.length > 0) {
          const frontCardIndex = order[0];
          const frontCard = cards[frontCardIndex];
          if (
            typeof frontCard === 'object' &&
            frontCard !== null &&
            'type' in frontCard
          ) {
            const frontCardElement = frontCard as React.ReactElement;
            const frontCardProps = frontCardElement.props || {};
            if (
              frontCardProps.currency !== undefined &&
              frontCardProps.backgroundColor === colors.semantic.background.white
            ) {
              isPreviousCardLight = true; // La primera es blanca, esta es la segunda
            }
          }
        }
        
        // Si está en tercera posición (isBack), verificar si la segunda es CurrencyCard clara
        if (isBack && cards.length > 1) {
          const middleCardIndex = order[1];
          const middleCard = cards[middleCardIndex];
          if (
            typeof middleCard === 'object' &&
            middleCard !== null &&
            'type' in middleCard
          ) {
            const middleCardElement = middleCard as React.ReactElement;
            const middleCardProps = middleCardElement.props || {};
            if (
              middleCardProps.currency !== undefined &&
              middleCardProps.backgroundColor === colors.semantic.background.white
            ) {
              isPreviousCardLight = true; // La segunda es blanca, esta es la tercera
            }
          }
        }
        
        // Si está en primera posición (isFront), verificar si la segunda es CurrencyCard clara
        if (isFront && cards.length > 1) {
          const middleCardIndex = order[1];
          const middleCard = cards[middleCardIndex];
          if (
            typeof middleCard === 'object' &&
            middleCard !== null &&
            'type' in middleCard
          ) {
            const middleCardElement = middleCard as React.ReactElement;
            const middleCardProps = middleCardElement.props || {};
            if (
              middleCardProps.currency !== undefined &&
              middleCardProps.backgroundColor === colors.semantic.background.white
            ) {
              isNextCardLight = true; // La segunda es blanca, esta es la primera
            }
          }
        }

        return (
          <div
            key={index}
            data-card-index={index}
            style={{
              position: isFront ? 'relative' : 'absolute',
              top: isFront ? 'auto' : '0',
              left: isFront ? 'auto' : '0',
              right: isFront ? 'auto' : '0',
              bottom: isFront ? 'auto' : '0',
              width: '100%',
              zIndex: cards.length - cardOrder,
              transition: 'none', // Sin animación inicial al cargar
              touchAction: 'none', // Deshabilitar gestos táctiles para permitir drag
              WebkitTouchCallout: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            {typeof card === 'object' && card !== null && 'type' in card
              ? (() => {
                  const cardElement = card as React.ReactElement;
                  const cardProps = cardElement.props || {};
                  // Determinar si es CurrencyCard (tiene prop 'currency')
                  const isCurrencyCard = cardProps.currency !== undefined;
                  // Props adicionales según el tipo de tarjeta
                  const additionalProps = isCurrencyCard
                    ? {
                        isFront,
                        isMiddle,
                        isBack,
                        isPreviousCardLight,
                        isNextCardLight,
                      }
                    : {
                        // VirtualCard también necesita las props de posición para el padding dinámico
                        isFront,
                        isMiddle,
                        isBack,
                      };
                  return React.cloneElement(cardElement, {
                    ...cardProps,
                    ...additionalProps,
                  });
                })()
              : card}
          </div>
        );
      })}
    </div>
  );
}
