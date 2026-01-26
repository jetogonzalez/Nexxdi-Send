"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';
import { useBalances } from '../../hooks/useBalances';
import { formatCurrency } from '../../lib/formatBalance';
import { AnimatedBalance } from './AnimatedBalance';

interface CardData {
  id: string;
  type: 'usd' | 'visa' | 'cop';
}

interface CardWalletSliderProps {
  onCardSelect?: (card: CardData) => void;
  onCardDoubleTap?: (card: CardData) => void;
  onFrontCardChange?: (card: CardData) => void;
  isBalanceVisible?: boolean;
  cardBalance?: number;
  cardBackground?: string;
  isCardBlocked?: boolean;
}

const CARD_HEIGHT = 136;
const CARD_OFFSET = 52;
const DRAG_SCALE = 0.97;
const DRAG_THRESHOLD = 25;
const MAX_DRAG = 40;

// Función para obtener bandera local
const getCurrencyFlag = (currencySymbol: string): string => {
  const currencyToCountry: Record<string, string> = {
    'USD': 'US',
    'COP': 'CO',
  };
  const countryCode = currencyToCountry[currencySymbol] || 'US';
  return `/img/icons/country-flags/${countryCode}.svg`;
};

// Card styles by type
const getCardStyles = (type: CardData['type'], cardBackground?: string) => {
  switch (type) {
    case 'usd':
      return { background: colors.semantic.background.white, color: colors.semantic.text.primary, border: `1px solid ${colors.gray[200]}`, backgroundImage: 'none' };
    case 'visa':
      return { 
        background: colors.primary.main, 
        color: colors.semantic.background.white, 
        border: 'none',
        backgroundImage: `url(${cardBackground || '/img/icons/cards/card-full-default-2x.png'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    case 'cop':
      return { background: colors.semantic.background.white, color: colors.semantic.text.primary, border: `1px solid ${colors.gray[200]}`, backgroundImage: 'none' };
    default:
      return { background: colors.semantic.background.white, color: colors.semantic.text.primary, border: `1px solid ${colors.gray[200]}`, backgroundImage: 'none' };
  }
};

const defaultCardOrder: CardData[] = [
  { id: 'cop', type: 'cop' },
  { id: 'visa', type: 'visa' },
  { id: 'usd', type: 'usd' },
];

const DOUBLE_TAP_DELAY = 300; // ms para detectar doble tap
const TAP_THRESHOLD = 20; // px máximo de movimiento para considerar tap

const CARD_ORDER_STORAGE_KEY = 'cardWalletSliderOrder';

// Función para obtener el orden inicial de las tarjetas
const getInitialCardOrder = (): CardData[] => {
  if (typeof window !== 'undefined') {
    const savedOrder = localStorage.getItem(CARD_ORDER_STORAGE_KEY);
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder) as CardData[];
        // Validar que el orden guardado tiene las mismas tarjetas
        if (parsedOrder.length === defaultCardOrder.length && 
            parsedOrder.every(card => defaultCardOrder.some(d => d.id === card.id))) {
          return parsedOrder;
        }
      } catch (e) {
        console.error('Error parsing card order:', e);
      }
    }
  }
  return defaultCardOrder;
};

export function CardWalletSlider({ onCardSelect, onCardDoubleTap, onFrontCardChange, isBalanceVisible = true, cardBalance = 379.21, cardBackground, isCardBlocked = false }: CardWalletSliderProps) {
  // Usar función inicializadora para cargar el orden inmediatamente sin saltos visuales
  const [cards, setCards] = useState<CardData[]>(getInitialCardOrder);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const startYRef = useRef(0);
  const draggingCardRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsStateRef = useRef(cards);
  const lastTapRef = useRef<{ cardId: string; time: number } | null>(null);
  const touchStartYRef = useRef(0);
  const touchCardIdRef = useRef<string | null>(null);
  const hasDraggedRef = useRef(false);

  // Guardar el orden de las tarjetas en localStorage cuando cambia
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CARD_ORDER_STORAGE_KEY, JSON.stringify(cards));
    }
  }, [cards]);

  // Notify parent when front card changes
  useEffect(() => {
    const frontCard = cards[cards.length - 1];
    onFrontCardChange?.(frontCard);
  }, [cards, onFrontCardChange]);

  // Keep ref in sync with state
  useEffect(() => {
    cardsStateRef.current = cards;
  }, [cards]);

  // Use balances hook for real-time updates
  const { usdBalance, copBalance } = useBalances();

  // Container height based on number of cards
  const containerHeight = CARD_HEIGHT + (cards.length - 1) * CARD_OFFSET;

  // Click on a card:
  // - Front card: single tap navigates, double tap also navigates
  // - Middle/back cards: bring to front only (no navigation)
  const handleCardClick = (cardId: string) => {
    if (Math.abs(dragOffset) > 5) return;
    
    const index = cards.findIndex(c => c.id === cardId);
    if (index === -1) return;
    
    const isTopCard = index === cards.length - 1;
    const now = Date.now();
    
    console.log('Card clicked:', cardId, 'index:', index, 'isTop:', isTopCard);
    
    // If it's the front card
    if (isTopCard) {
      // Check for double tap
      if (lastTapRef.current && 
          lastTapRef.current.cardId === cardId && 
          now - lastTapRef.current.time < DOUBLE_TAP_DELAY) {
        // Double tap detected on front card
        lastTapRef.current = null;
        onCardDoubleTap?.(cards[index]);
        return;
      }
      
      // Record this tap
      lastTapRef.current = { cardId, time: now };
      
      // Single tap on front card - navigate
      onCardSelect?.(cards[index]);
      return;
    }

    // Middle or back card - just bring to front (no navigation)
    console.log('Moving card to front:', cardId, 'from index:', index);
    // Remove the clicked card and add it to the end (front position)
    const clickedCard = cards[index];
    const remainingCards = cards.filter((_, i) => i !== index);
    const newCards = [...remainingCards, clickedCard];
    console.log('New order:', newCards.map(c => c.id));
    setCards(newCards);
    // Reset tap ref when changing cards
    lastTapRef.current = null;
  };

  // Drag start
  const handleDragStart = useCallback((cardId: string, clientY: number) => {
    const currentCards = cardsStateRef.current;
    if (cardId !== currentCards[currentCards.length - 1].id) return;
    
    setIsDragging(true);
    startYRef.current = clientY;
    draggingCardRef.current = cardId;
  }, []);

  // Drag move
  const handleDragMove = useCallback((clientY: number) => {
    if (!draggingCardRef.current) return;
    
    const offset = clientY - startYRef.current;
    
    // Mark as dragged if movement exceeds tap threshold
    if (Math.abs(offset) > TAP_THRESHOLD) {
      hasDraggedRef.current = true;
    }
    
    const dampedOffset = Math.sign(offset) * Math.min(MAX_DRAG, Math.abs(offset) * 0.5);
    setDragOffset(dampedOffset);
  }, []);

  // Drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    
    setCards(prevCards => {
      const currentOffset = dragOffset;
      if (currentOffset > DRAG_THRESHOLD) {
        const frontCard = prevCards[prevCards.length - 1];
        return [frontCard, ...prevCards.slice(0, -1)];
      }
      else if (currentOffset < -DRAG_THRESHOLD) {
        const backCard = prevCards[0];
        return [...prevCards.slice(1), backCard];
      }
      return prevCards;
    });

    setDragOffset(0);
    draggingCardRef.current = null;
  }, [dragOffset]);

  // Handle tap/double tap on touch end
  // - Front card: single tap navigates, double tap also navigates
  // - Middle/back cards: bring to front only (no navigation)
  const handleTouchTap = useCallback((cardId: string) => {
    const currentCards = cardsStateRef.current;
    const index = currentCards.findIndex(c => c.id === cardId);
    if (index === -1) return;
    
    const isTopCard = index === currentCards.length - 1;
    const now = Date.now();
    
    console.log('Touch tap:', cardId, 'index:', index, 'isTop:', isTopCard);
    
    // If it's the front card
    if (isTopCard) {
      // Check for double tap
      if (lastTapRef.current && 
          lastTapRef.current.cardId === cardId && 
          now - lastTapRef.current.time < DOUBLE_TAP_DELAY) {
        // Double tap detected on front card
        lastTapRef.current = null;
        onCardDoubleTap?.(currentCards[index]);
        return;
      }
      
      // Record this tap
      lastTapRef.current = { cardId, time: now };
      
      // Single tap on front card - navigate
      onCardSelect?.(currentCards[index]);
      return;
    }

    // Middle or back card - just bring to front (no navigation)
    console.log('Touch moving card to front:', cardId, 'from index:', index);
    // Remove the clicked card and add it to the end (front position)
    const clickedCard = currentCards[index];
    const remainingCards = currentCards.filter((_, i) => i !== index);
    const newCards = [...remainingCards, clickedCard];
    console.log('Touch new order:', newCards.map(c => c.id));
    setCards(newCards);
    // Reset tap ref when changing cards
    lastTapRef.current = null;
  }, [onCardDoubleTap, onCardSelect]);

  // Touch event handlers with preventDefault for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onTouchMove = (e: TouchEvent) => {
      if (draggingCardRef.current) {
        e.preventDefault();
        handleDragMove(e.touches[0].clientY);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const cardId = touchCardIdRef.current;
      const startY = touchStartYRef.current;
      const endY = e.changedTouches[0]?.clientY || startY;
      const moveDistance = Math.abs(endY - startY);
      const wasDragged = hasDraggedRef.current;
      
      // Only treat as tap if no significant drag happened
      if (cardId && moveDistance < TAP_THRESHOLD && !wasDragged) {
        handleTouchTap(cardId);
      }
      
      if (draggingCardRef.current) {
        handleDragEnd();
      }
      
      // Reset refs
      touchCardIdRef.current = null;
      hasDraggedRef.current = false;
    };

    const onTouchCancel = () => {
      if (draggingCardRef.current) {
        handleDragEnd();
      }
      touchCardIdRef.current = null;
    };

    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchCancel);

    return () => {
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [handleDragMove, handleDragEnd, handleTouchTap]);

  // Touch start handler
  const handleTouchStart = (cardId: string, e: React.TouchEvent) => {
    console.log('Touch start on card:', cardId);
    touchCardIdRef.current = cardId;
    touchStartYRef.current = e.touches[0].clientY;
    hasDraggedRef.current = false; // Reset drag flag
    handleDragStart(cardId, e.touches[0].clientY);
  };

  // Mouse handlers
  const handleMouseDown = (cardId: string, e: React.MouseEvent) => {
    handleDragStart(cardId, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingCardRef.current) {
      handleDragMove(e.clientY);
    }
  };

  const handleMouseUp = () => {
    if (draggingCardRef.current) {
      handleDragEnd();
    }
  };

  // Render card content based on type
  const renderCardContent = (card: CardData) => {
    const textColor = card.type === 'visa' ? colors.semantic.background.white : colors.semantic.text.primary;

    if (card.type === 'visa') {
      return (
        <>
          {/* Overlay de bloqueo - debajo de los controles */}
          {isCardBlocked && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 24,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
          )}
          
          {/* Contenido de bloqueo centrado - contenedor circular como en TarjetaView */}
          {isCardBlocked && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing[2],
                zIndex: 2,
                pointerEvents: 'none',
              }}
            >
              {/* Contenedor circular blanco */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/img/icons/global/lock.svg"
                  alt="Bloqueada"
                  style={{
                    width: 24,
                    height: 24,
                    display: 'block',
                    filter: 'none', // Negro (sin filtro)
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: typography.fontWeight.extrabold,
                  color: colors.semantic.background.white,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  whiteSpace: 'nowrap',
                }}
              >
                Tarjeta bloqueada
              </span>
            </div>
          )}

          {/* Top row - VISA logo a la izquierda, centrado verticalmente (encima del overlay) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', position: 'relative', zIndex: 3, height: 32 }}>
            <img 
              src="/img/icons/payment/logo-visa.svg" 
              alt="VISA" 
              style={{ 
                height: 16,
                opacity: isCardBlocked ? 0.5 : 1,
              }}
            />
          </div>
          {/* Bottom row - Balance + USD (oculto cuando está bloqueada) */}
          {!isCardBlocked && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing[2], position: 'relative', zIndex: 3 }}>
              {isBalanceVisible ? (
                <AnimatedBalance
                  value={cardBalance}
                  balanceKey="visa"
                  duration={600}
                  formatValue={(val) => formatCurrency(val, 'USD', false)}
                  style={{ 
                    fontSize: 32,
                    fontWeight: typography.fontWeight.extrabold,
                    color: textColor,
                    fontFamily: typography.fontFamily.sans.join(', '),
                    letterSpacing: '-0.04em',
                  }}
                />
              ) : (
                <span style={{ 
                  fontSize: 32,
                  fontWeight: typography.fontWeight.extrabold,
                  color: textColor,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  letterSpacing: '-0.04em',
                }}>
                  •••
                </span>
              )}
              {isBalanceVisible && (
                <span style={{ 
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontFamily: typography.fontFamily.sans.join(', '),
                }}>
                  USD
                </span>
              )}
            </div>
          )}
        </>
      );
    }

    // Currency cards (USD, COP)
    const currencySymbol = card.type.toUpperCase();
    const balance = card.type === 'usd' ? usdBalance : copBalance;

    return (
      <>
        {/* Top row - Flag + Currency */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <img
              src={getCurrencyFlag(currencySymbol)}
              alt={currencySymbol}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <span style={{ 
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.extrabold,
              color: textColor,
              fontFamily: typography.fontFamily.sans.join(', '),
            }}>
              {currencySymbol}
            </span>
          </div>
        </div>
        {/* Bottom row - Balance (sin signo de moneda) */}
        {isBalanceVisible ? (
          <AnimatedBalance
            value={balance}
            balanceKey={card.type}
            duration={600}
            formatValue={(val) => formatCurrency(val, currencySymbol, false)}
            style={{ 
              fontSize: 32,
              fontWeight: typography.fontWeight.extrabold,
              color: textColor,
              fontFamily: typography.fontFamily.sans.join(', '),
              letterSpacing: '-0.04em',
            }}
          />
        ) : (
          <span style={{ 
            fontSize: 32,
            fontWeight: typography.fontWeight.extrabold,
            color: textColor,
            fontFamily: typography.fontFamily.sans.join(', '),
            letterSpacing: '-0.04em',
          }}>
            •••
          </span>
        )}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: `${containerHeight}px`,
        position: 'relative',
        touchAction: 'pan-x',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {cards.map((card, index) => {
        const styles = getCardStyles(card.type, cardBackground);
        const isTop = index === cards.length - 1;
        const isDraggingThis = isDragging && draggingCardRef.current === card.id;

        const baseTop = index * CARD_OFFSET;
        const currentTop = isDraggingThis ? baseTop + dragOffset : baseTop;
        const scale = isDraggingThis && Math.abs(dragOffset) > 5 ? DRAG_SCALE : 1;
        
        // Padding: front card = 24px all, others = 12px top, 24px sides, 24px bottom
        const cardPadding = isTop ? '24px' : '12px 24px 24px 24px';
        
        // Altura clickeable: solo la parte visible (no cubierta por la tarjeta de adelante)
        // Para tarjetas de atrás/medio: solo el "tab" visible (CARD_OFFSET px)
        // Para tarjeta frontal: toda la altura
        const clickableHeight = isTop ? CARD_HEIGHT : CARD_OFFSET;

        return (
          <div
            key={card.id}
            className="no-press-effect"
            style={{
              position: 'absolute',
              width: '100%',
              height: `${CARD_HEIGHT}px`,
              borderRadius: 24,
              padding: cardPadding,
              left: 0,
              top: `${currentTop}px`,
              background: styles.background,
              backgroundImage: styles.backgroundImage,
              backgroundSize: styles.backgroundSize,
              backgroundPosition: styles.backgroundPosition,
              color: styles.color,
              border: styles.border,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              cursor: isTop ? 'grab' : 'pointer',
              zIndex: index + 1,
              transform: `scale(${scale})`,
              transition: isDraggingThis ? 'transform 0.1s ease' : 'all 0.3s cubic-bezier(.25,.8,.25,1)',
              transformOrigin: 'center center',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
              touchAction: 'pan-x',
              overflow: 'hidden',
              pointerEvents: 'none', // Desactivar eventos en la tarjeta completa
            }}
          >
            {renderCardContent(card)}
            
            {/* Zona clickeable: solo la parte visible */}
            <div
              onClick={() => handleCardClick(card.id)}
              onMouseDown={(e) => handleMouseDown(card.id, e)}
              onTouchStart={(e) => handleTouchStart(card.id, e)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: `${clickableHeight}px`,
                zIndex: 100,
                pointerEvents: 'auto', // Activar eventos solo en esta zona
                cursor: isTop ? 'grab' : 'pointer',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
