// Sistema de perfiles de usuario
// Cambiar ACTIVE_PROFILE para alternar entre usuarios

export type ProfileType = 'luis' | 'jetto';

// ⚡ CAMBIAR AQUÍ EL PERFIL ACTIVO ⚡
export const ACTIVE_PROFILE: ProfileType = 'jetto';

interface UserProfile {
  id: ProfileType;
  firstName: string;
  fullName: string;
  cardName: string;
  greeting: string;
  photo: string;
}

const profiles: Record<ProfileType, UserProfile> = {
  luis: {
    id: 'luis',
    firstName: 'Luis',
    fullName: 'Luis Fernando Plaza Renteria',
    cardName: 'LUIS F PLAZA RENTERIA',
    greeting: 'Hola, Luis',
    photo: '/img/user/fernando-plaza.jpg',
  },
  jetto: {
    id: 'jetto',
    firstName: 'Jetto',
    fullName: 'Jefferson González',
    cardName: 'JEFFERSON GONZALEZ',
    greeting: 'Hola, Jetto',
    photo: '/img/user/jetto-gonzalez.JPG',
  },
};

// Exportar el perfil activo
export const currentUser = profiles[ACTIVE_PROFILE];

// Helper para obtener cualquier perfil
export const getProfile = (profileId: ProfileType): UserProfile => profiles[profileId];
