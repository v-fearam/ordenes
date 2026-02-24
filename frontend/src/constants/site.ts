export const SITE = {
  name: 'Portal de Seguimiento',
  company: 'Snoop Consulting',
  apiUrl: import.meta.env.VITE_API_URL ?? '',
} as const;

export const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Ordenes de Compra', path: '/admin/ordenes' },
  { label: 'Proveedores', path: '/admin/proveedores' },
] as const;

export const ESTADO_OC = {
  EMITIDA: 'EMITIDA',
  ACEPTADA: 'ACEPTADA',
  NO_ACEPTADA: 'NO_ACEPTADA',
  EN_SEGUIMIENTO: 'EN_SEGUIMIENTO',
  ENTREGA_CONFIRMADA: 'ENTREGA_CONFIRMADA',
  VALIDADA_CLIENTE: 'VALIDADA_CLIENTE',
  CERRADA: 'CERRADA',
  INCUMPLIMIENTO: 'INCUMPLIMIENTO',
} as const;

export type EstadoOC = (typeof ESTADO_OC)[keyof typeof ESTADO_OC];

export const ESTADO_LABELS: Record<EstadoOC, string> = {
  EMITIDA: 'Emitida',
  ACEPTADA: 'Aceptada',
  NO_ACEPTADA: 'No Aceptada',
  EN_SEGUIMIENTO: 'En Seguimiento',
  ENTREGA_CONFIRMADA: 'Entrega Confirmada',
  VALIDADA_CLIENTE: 'Validada',
  CERRADA: 'Cerrada',
  INCUMPLIMIENTO: 'Incumplimiento',
};

export const ESTADO_BADGE: Record<EstadoOC, string> = {
  EMITIDA: 'badge-info',
  ACEPTADA: 'badge-success',
  NO_ACEPTADA: 'badge-danger',
  EN_SEGUIMIENTO: 'badge-warning',
  ENTREGA_CONFIRMADA: 'badge-info',
  VALIDADA_CLIENTE: 'badge-success',
  CERRADA: 'badge-neutral',
  INCUMPLIMIENTO: 'badge-danger',
};
