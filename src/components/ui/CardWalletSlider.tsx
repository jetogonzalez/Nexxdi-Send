"use client";

import { useState, useRef } from 'react';
import { colors, spacing, typography, borderRadius } from '../../config/design-tokens';
import { useBalances } from '../../hooks/useBalances';
import { formatCurrency } from '../../lib/formatBalance';

interface CardData {
  id: string;
  type: 'usd' | 'visa' | 'cop';
}

interface CardWalletSliderProps {
  onCardSelect?: (card: CardData) => void;
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

export function CardWalletSlider({ onCardSelect, isBalanceVisible = true, cardBalance = 379.21, cardBackground }: CardWalletSliderProps) {
  const [cards, setCards] = useState<CardData[]>(defaultCardOrder);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const startYRef = useRef(0);
  const draggingCardRef = useRef<string | null>(null);

  // Use balances hook for real-time updates
  const { usdBalance, copBalance } = useBalances();

  // Container height based on number of cards
  const containerHeight = CARD_HEIGHT + (cards.length - 1) * CARD_OFFSET;

  // Click on a card brings it to front (moves it to end of array)
  const handleCardClick = (cardId: string) => {
    if (Math.abs(dragOffset) > 5) return;
    
    const index = cards.findIndex(c => c.id === cardId);
    if (index === cards.length - 1) {
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
  const handleDragStart = (cardId: string, clientY: number) => {
    if (cardId !== cards[cards.length - 1].id) return;
    
    setIsDragging(true);
    startYRef.current = clientY;
    draggingCardRef.current = cardId;
  };

  // Drag move
  const handleDragMove = (clientY: number) => {
    if (!isDragging || !draggingCardRef.current) return;
    
    const offset = clientY - startYRef.current;
    const dampedOffset = Math.sign(offset) * Math.min(MAX_DRAG, Math.abs(offset) * 0.5);
    setDragOffset(dampedOffset);
  };

  // Drag end
  const handleDragEnd = () => {
    if (!isDragging) return;

    if (dragOffset > DRAG_THRESHOLD) {
      const frontCard = cards[cards.length - 1];
      const newCards = [frontCard, ...cards.slice(0, -1)];
      setCards(newCards);
    }
    else if (dragOffset < -DRAG_THRESHOLD) {
      const backCard = cards[0];
      const newCards = [...cards.slice(1), backCard];
      setCards(newCards);
    }

    setIsDragging(false);
    setDragOffset(0);
    draggingCardRef.current = null;
  };

  // Touch handlers
  const handleTouchStart = (cardId: string, e: React.TouchEvent) => {
    handleDragStart(cardId, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  };

  // Mouse handlers
  const handleMouseDown = (cardId: string, e: React.MouseEvent) => {
    handleDragStart(cardId, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientY);
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
            <span style={{ 
              fontSize: 32,
              fontWeight: typography.fontWeight.bold,
              color: textColor,
              fontFamily: typography.fontFamily.sans.join(', '),
              letterSpacing: '-0.04em',
            }}>
              {isBalanceVisible ? formatCurrency(cardBalance, 'USD', false) : '•••'}
            </span>
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
        <span style={{ 
          fontSize: 32,
          fontWeight: typography.fontWeight.bold,
          color: textColor,
          fontFamily: typography.fontFamily.sans.join(', '),
          letterSpacing: '-0.04em',
        }}>
          {isBalanceVisible ? formatCurrency(balance, currencySymbol, false) : '•••'}
        </span>
      </>
    );
  };

  return (
    <div
      style={{
        width: '100%',
        height: `${containerHeight}px`,
        position: 'relative',
        touchAction: 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleDragEnd}
      onTouchCancel={handleDragEnd}
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
            }}
          >
            {renderCardContent(card)}
          </div>
        );
      })}
    </div>
  );
}
