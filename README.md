# Nexxdi Cash

Aplicación móvil de billetera digital construida con Astro, React y Firebase. Disponible como PWA y apps nativas iOS/Android.

## 🚀 Características Principales

### Funcionalidades de Usuario
- 💸 **Enviar dinero** - Transferencias entre usuarios y a destinos internacionales
- 🔄 **Cambiar moneda** - Conversión entre USD y COP con tasas en tiempo real
- 💳 **Tarjeta virtual** - Gestión de tarjeta con bloqueo/desbloqueo biométrico
- 📊 **Movimientos** - Historial de transacciones sincronizado en tiempo real
- 👁️ **Privacidad** - Ocultar/mostrar saldos con un toque

### Características Técnicas
- ✅ PWA completa (instalable en iOS y Android)
- ✅ Apps nativas iOS y Android con Capacitor
- ✅ Service Worker para funcionamiento offline
- ✅ Autenticación biométrica (Face ID / Touch ID)
- ✅ Tasas de cambio en tiempo real
- ✅ Persistencia de datos en sesión
- ✅ Sincronización automática de saldos entre vistas
- ✅ Design tokens centralizados
- ✅ Animaciones fluidas con Framer Motion

## 🏗️ Arquitectura

### Componentes Principales

```
src/components/
├── home/
│   ├── HomePage.tsx          # Contenedor principal con navegación
│   ├── HomeView.tsx          # Vista de inicio con acciones rápidas
│   ├── WalletView.tsx        # Vista de cuentas y saldos
│   ├── CashView.tsx          # Vista de Cash con envío/cambio
│   ├── TarjetaView.tsx       # Vista de tarjeta virtual
│   └── RecentMovements.tsx   # Lista de movimientos recientes
├── ui/
│   ├── BottomSheet.tsx       # Modal deslizable desde abajo
│   ├── SendMoneySheet.tsx    # Modal de envío de dinero (compartida)
│   ├── ExchangeMoneySheet.tsx# Modal de cambio de moneda (compartida)
│   ├── SliderToBlock.tsx     # Slider deslizable para confirmar acciones
│   └── SegmentedButton.tsx   # Botón segmentado para filtros
└── auth/
    ├── LoginPage.tsx         # Página de login
    └── FaceIDButton.tsx      # Botón de autenticación biométrica
```

### Hooks Personalizados

```
src/hooks/
├── useBalances.ts        # Manejo de saldos USD/COP con persistencia
├── useMovements.ts       # Historial de movimientos con localStorage
└── useExchangeRates.ts   # Tasas de cambio en tiempo real (API externa)
```

### Design Tokens

```
src/config/
├── design-tokens.ts      # Colores, tipografía, espaciado, bordes
└── transitions-tokens.ts # Animaciones y transiciones
```

## 📋 Prerequisitos

- Node.js 18+ y npm
- Cuenta de Firebase
- Git

## 🛠️ Instalación

1. **Clonar e instalar dependencias:**
```bash
git clone https://github.com/jetogonzalez/Nexxdi-Send.git
cd Nexxdi-Send
npm install
```

2. **Iniciar desarrollo:**
```bash
npm run dev
```

La app estará disponible en `http://localhost:4321`

## 📦 Build y Despliegue

### Firebase Hosting

```bash
# Build y deploy
npm run build
firebase deploy --only hosting
```

**URL de producción:** https://nexxdi-send-jetto-gonzalez.web.app

## 🎨 Flujos de Usuario

### Enviar Dinero
1. Usuario toca botón "Enviar" (disponible en Home, Wallet o Cash)
2. Se abre modal `SendMoneySheet`
3. Ingresa monto y selecciona moneda de origen
4. Selecciona moneda de destino (búsqueda por país o moneda)
5. Ve resumen con tasa de cambio y timer de validez
6. Confirma con botón "Continuar"

### Cambiar Moneda
1. Usuario toca botón "Cambiar" (disponible en Home, Wallet o Cash)
2. Se abre modal `ExchangeMoneySheet`
3. Selecciona cuenta origen (USD o COP)
4. Ingresa monto (máximo = saldo disponible)
5. Ve conversión automática en cuenta destino
6. Desliza slider para confirmar
7. Saldos se actualizan automáticamente en todas las vistas
8. Movimiento se registra en historial

### Bloquear/Desbloquear Tarjeta
1. Usuario va a vista "Tarjeta"
2. Toca botón de candado
3. Se autentica con Face ID / Touch ID
4. Tarjeta cambia de estado (bloqueada ↔ desbloqueada)

## 📱 Instalar en Dispositivos

### Android (PWA):
1. Abre https://nexxdi-send-jetto-gonzalez.web.app en Chrome
2. Menú → "Añadir a pantalla de inicio"

### iOS (PWA):
1. Abre la URL en Safari
2. Compartir → "Añadir a pantalla de inicio"

## 📝 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build local |
| `npm run deploy` | Build y deploy a Firebase |
| `npm run build:sync` | Build y sincronizar con Capacitor |
| `npm run open:ios` | Abrir proyecto iOS en Xcode |
| `npm run open:android` | Abrir proyecto Android Studio |

## 🔐 API de Tasas de Cambio

La aplicación utiliza la API gratuita de [fawazahmed0/currency-api](https://github.com/fawazahmed0/currency-api) para obtener tasas de cambio en tiempo real.

- Actualización automática cada 60 segundos
- Fallback a tasas por defecto si la API no está disponible
- Cache en memoria para optimizar rendimiento

## 📚 Documentación Adicional

- `PASOS_RAPIDOS_ANDROID.md` - Guía rápida para distribuir Android
- `CONFIGURAR_ANDROID.md` - Configuración completa de Android
- `CONVERTIR_A_NATIVA.md` - Guía completa para apps nativas
- `INSTALAR_EN_IPHONE.md` - Instrucciones de instalación PWA en iPhone

## 🐛 Troubleshooting

**Saldos no se actualizan:**
- Los saldos se guardan en `sessionStorage`
- Cierra todas las pestañas y vuelve a abrir

**Tasas de cambio no cargan:**
- Verifica conexión a internet
- La app usa tasas por defecto como fallback

**Movimientos no aparecen:**
- Los movimientos se guardan en `localStorage`
- Limpia cache del navegador si hay problemas

## 📄 Licencia

MIT

---

Desarrollado con ❤️ por Jetto González
