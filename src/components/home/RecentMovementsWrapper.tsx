"use client";

import { RecentMovements } from './RecentMovements';
import { useMovements } from '../../hooks/useMovements';

interface RecentMovementsWrapperProps {
  isBalanceVisible?: boolean;
  maxItems?: number;
  filterBySource?: 'wallet' | 'card' | 'general'; // Filtrar por fuente: wallet (cuentas), card (tarjeta), general (todos)
}

/**
 * Wrapper cliente para RecentMovements que maneja el hook useMovements
 * Necesario porque HomeView puede no ser un componente cliente
 * 
 * - filterBySource='general' o undefined: Muestra TODOS los movimientos (HomeView - matriz general)
 * - filterBySource='wallet': Solo movimientos de cuentas/monedas (WalletView)
 * - filterBySource='card': Solo movimientos de tarjeta/compras (TarjetaView)
 */
export function RecentMovementsWrapper({ isBalanceVisible = true, maxItems = 3, filterBySource }: RecentMovementsWrapperProps) {
  const { movements } = useMovements();
  
  return <RecentMovements movements={movements} isBalanceVisible={isBalanceVisible} maxItems={maxItems} filterBySource={filterBySource} />;
}
