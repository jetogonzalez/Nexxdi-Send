import { colors, spacing, typography } from '../../config/design-tokens';
import { formatBalance } from '../../lib/formatBalance';

interface WalletViewProps {
  isBalanceVisible?: boolean;
  titleRef?: (el: HTMLElement | null) => void;
  scrollProgress?: number;
}

export function WalletView({ isBalanceVisible = true, titleRef, scrollProgress = 0 }: WalletViewProps) {
  const title = 'Wallet';
  const balance = 2344.02;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: spacing[4], // 16px
        paddingBottom: spacing[10], // 40px
        backgroundColor: colors.semantic.background.main,
      }}
    >
      <h1
        ref={(el) => {
          if (titleRef) titleRef(el);
        }}
        style={{
          fontSize: typography.sectionTitle.fontSize,
          fontWeight: typography.sectionTitle.fontWeight,
          lineHeight: typography.sectionTitle.lineHeight,
          color: typography.sectionTitle.color,
          fontFamily: typography.sectionTitle.fontFamily,
        }}
      >
        {title}
      </h1>
      
      {/* Balance principal */}
      <div
        style={{
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.bold,
          color: colors.semantic.text.primary,
          fontFamily: typography.fontFamily.sans.join(', '),
        }}
      >
        {formatBalance(balance, isBalanceVisible)}
      </div>
      
      <p
        style={{
          fontSize: typography.fontSize.base,
          color: colors.semantic.text.secondary,
          fontFamily: typography.fontFamily.sans.join(', '),
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Este es un texto de ejemplo para verificar el contraste del tab bar con respecto al contenido. 
        El fondo del tab bar debe tener suficiente contraste para que los elementos sean claramente visibles 
        y legibles sobre cualquier contenido que se muestre en la pantalla. Este texto ayuda a visualizar 
        cómo se ve el tab bar cuando hay contenido detrás de él.
      </p>
      <p
        style={{
          fontSize: typography.fontSize.base,
          color: colors.semantic.text.secondary,
          fontFamily: typography.fontFamily.sans.join(', '),
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Puedes agregar más contenido aquí para probar diferentes escenarios de contraste y asegurarte 
        de que el tab bar siempre sea visible y accesible, independientemente del contenido que se muestre 
        en la pantalla principal.
      </p>

      <h2
        style={{
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.bold,
          color: colors.semantic.text.primary,
          fontFamily: typography.fontFamily.sans.join(', '),
        }}
      >
        Título de Nivel 2
      </h2>
      <p
        style={{
          fontSize: typography.fontSize.base,
          color: colors.semantic.text.secondary,
          fontFamily: typography.fontFamily.sans.join(', '),
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Este es un párrafo normal que sigue a un título de nivel 2. El texto debe ser legible y tener 
        buen contraste con el fondo del tab bar cuando se hace scroll.
      </p>

      <h3
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.semantic.text.primary,
          fontFamily: typography.fontFamily.sans.join(', '),
        }}
      >
        Título de Nivel 3
      </h3>
      <p
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.semantic.text.secondary,
          fontFamily: typography.fontFamily.sans.join(', '),
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Este es un párrafo más pequeño que sigue a un título de nivel 3. Los diferentes tamaños de texto 
        ayudan a verificar que todos los niveles de jerarquía tienen buen contraste.
      </p>

      <h4
        style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.semibold,
          color: colors.semantic.text.primary,
          fontFamily: typography.fontFamily.sans.join(', '),
        }}
      >
        Título de Nivel 4
      </h4>
      <p
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.semantic.text.tertiary,
          fontFamily: typography.fontFamily.sans.join(', '),
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Este es un texto terciario más pequeño. Diferentes niveles de jerarquía y colores de texto 
        permiten verificar que el tab bar mantiene buen contraste en todos los casos.
      </p>

      <h2
        style={{
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.bold,
          color: colors.semantic.text.primary,
          fontFamily: typography.fontFamily.sans.join(', '),
        }}
      >
        Lista de Elementos
      </h2>
      <ul
        style={{
          fontSize: typography.fontSize.base,
          color: colors.semantic.text.secondary,
          fontFamily: typography.fontFamily.sans.join(', '),
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        <li>Primer elemento de la lista</li>
        <li>Segundo elemento de la lista</li>
        <li>Tercer elemento de la lista</li>
        <li>Cuarto elemento de la lista</li>
      </ul>

      <p
        style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.medium,
          color: colors.semantic.text.primary,
          fontFamily: typography.fontFamily.sans.join(', '),
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Este es un párrafo con texto en negrita para mostrar otro nivel de jerarquía visual. 
        El contraste debe ser adecuado para todos los pesos de fuente.
      </p>

      <p
        style={{
          fontSize: typography.fontSize.xs,
          color: colors.semantic.text.tertiary,
          fontFamily: typography.fontFamily.sans.join(', '),
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        Este es un texto muy pequeño (xs) con color terciario. Incluso en este tamaño, el tab bar 
        debe mantener buen contraste y visibilidad sobre el contenido.
      </p>
    </div>
  );
}
