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
  isBalanceVisible?: boolean;
  cardBalance?: number;
  cardBackground?: string;
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

export function CardWalletSlider({ onCardSelect, onCardDoubleTap, isBalanceVisible = true, cardBalance = 379.21, cardBackground }: CardWalletSliderProps) {
  const [cards, setCards] = useState<CardData[]>(defaultCardOrder);
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

  // Keep ref in sync with state
  useEffect(() => {
    cardsStateRef.current = cards;
  }, [cards]);

  // Use balances hook for real-time updates
  const { usdBalance, copBalance } = useBalances();

  // Container height based on number of cards
  const containerHeight = CARD_HEIGHT + (cards.length - 1) * CARD_OFFSET;

  // Click on a card brings it to front (moves it to end of array)
  // Double tap on front card triggers navigation
  const handleCardClick = (cardId: string) => {
    if (Math.abs(dragOffset) > 5) return;
    
    const index = cards.findIndex(c => c.id === cardId);
    const isTopCard = index === cards.length - 1;
    const now = Date.now();
    
    // Check for double tap on front card
    if (isTopCard && lastTapRef.current && 
        lastTapRef.current.cardId === cardId && 
        now - lastTapRef.current.time < DOUBLE_TAP_DELAY) {
      // Double tap detected on front card
      lastTapRef.current = null;
      onCardDoubleTap?.(cards[index]);
      return;
    }
    
    // Record this tap
    lastTapRef.current = { cardId, time: now };
    
    if (isTopCard) {
      onCardSelect?.(cards[index]);
      return;
    }

    const newCards = [
      ...cards.slice(0, index),
      ...cards.slice(index + 1),
      cards[index]
    ];
    setCards(newCards);
    onCardSelect?.(cards[index]);
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
  const handleTouchTap = useCallback((cardId: string) => {
    const currentCards = cardsStateRef.current;
    const index = currentCards.findIndex(c => c.id === cardId);
    const isTopCard = index === currentCards.length - 1;
    const now = Date.now();
    
    // Check for double tap on front card
    if (isTopCard && lastTapRef.current && 
        lastTapRef.current.cardId === cardId && 
        now - lastTapRef.current.time < DOUBLE_TAP_DELAY) {
      // Double tap detected on front card
      lastTapRef.current = null;
      onCardDoubleTap?.(currentCards[index]);
      return;
    }
    
    // Record this tap
    lastTapRef.current = { cardId, time: now };
    
    if (isTopCard) {
      onCardSelect?.(currentCards[index]);
      return;
    }

    // Bring card to front
    const newCards = [
      ...currentCards.slice(0, index),
      ...currentCards.slice(index + 1),
      currentCards[index]
    ];
    setCards(newCards);
    onCardSelect?.(currentCards[index]);
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

  // Options button component
  const OptionsButton = ({ isVisa = false }: { isVisa?: boolean }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        console.log('Options clicked');
      }}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: 'none',
        background: isVisa ? colors.semantic.background.cardButtonIcon : colors.semantic.button.secondary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <img 
        src="/img/icons/global/icon-dots.svg" 
        alt="Opciones"
        style={{ 
          width: 16, 
          height: 16,
          filter: isVisa ? 'brightness(0) invert(1)' : 'none',
        }}
      />
    </button>
  );

  // Render card content based on type
  const renderCardContent = (card: CardData) => {
    const textColor = card.type === 'visa' ? colors.semantic.background.white : colors.semantic.text.primary;

    if (card.type === 'visa') {
      return (
        <>
          {/* Top row - VISA logo + Options */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <img 
              src="/img/icons/payment/logo-visa.svg" 
              alt="VISA" 
              style={{ height: 16 }}
            />
            <OptionsButton isVisa />
          </div>
          {/* Bottom row - Balance + USD */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing[2] }}>
            {isBalanceVisible ? (
              <AnimatedBalance
                value={cardBalance}
                duration={600}
                formatValue={(val) => formatCurrency(val, 'USD', false)}
                style={{ 
                  fontSize: 32,
                  fontWeight: typography.fontWeight.bold,
                  color: textColor,
                  fontFamily: typography.fontFamily.sans.join(', '),
                  letterSpacing: '-0.04em',
                }}
              />
            ) : (
              <span style={{ 
                fontSize: 32,
                fontWeight: typography.fontWeight.bold,
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
                fontWeight: typography.fontWeight.semibold,
                color: 'rgba(255, 255, 255, 0.85)',
                fontFamily: typography.fontFamily.sans.join(', '),
              }}>
                USD
              </span>
            )}
          </div>
        </>
      );
    }

    // Currency cards (USD, COP)
    const currencySymbol = card.type.toUpperCase();
    const balance = card.type === 'usd' ? usdBalance : copBalance;

    return (
      <>
        {/* Top row - Flag + Currency + Options */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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
            fontWeight: typography.fontWeight.bold,
            color: textColor,
            fontFamily: typography.fontFamily.sans.join(', '),
          }}>
            {currencySymbol}
          </span>
          </div>
          <OptionsButton />
        </div>
        {/* Bottom row - Balance (sin signo de moneda) */}
        {isBalanceVisible ? (
          <AnimatedBalance
            value={balance}
            duration={600}
            formatValue={(val) => formatCurrency(val, currencySymbol, false)}
            style={{ 
              fontSize: 32,
              fontWeight: typography.fontWeight.bold,
              color: textColor,
              fontFamily: typography.fontFamily.sans.join(', '),
              letterSpacing: '-0.04em',
            }}
          />
        ) : (
          <span style={{ 
            fontSize: 32,
            fontWeight: typography.fontWeight.bold,
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

        return (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            onMouseDown={(e) => handleMouseDown(card.id, e)}
            onTouchStart={(e) => handleTouchStart(card.id, e)}
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
            }}
          >
            {renderCardContent(card)}
          </div>
        );
      })}
    </div>
  );
}
