import type { EstadoOC } from '../constants/site';

export interface Proveedor {
  id: string;
  nombre: string;
  cuit: string;
  contacto: string;
  email: string;
  telefono: string;
  ocsActivas: number;
  activo: boolean;
}

export interface OrdenCompra {
  id: string;
  numero: string;
  proveedorId: string;
  proveedorNombre: string;
  descripcion: string;
  monto: number;
  fechaEmision: string;
  fechaEntrega: string;
  estado: EstadoOC;
  observaciones?: string;
}

export type UserRole = 'admin' | 'proveedor';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  proveedorId?: string;
  proveedorNombre?: string;
}

export interface Alerta {
  id: string;
  tipo: 'roja' | 'amarilla' | 'verde';
  mensaje: string;
  ocNumero: string;
  proveedor: string;
  fecha: string;
}

export const mockProveedores: Proveedor[] = [
  { id: '1', nombre: 'Tech Solutions SRL', cuit: '30-71234567-0', contacto: 'Carlos Mendez', email: 'carlos@techsolutions.com', telefono: '11-4567-8901', ocsActivas: 3, activo: true },
  { id: '2', nombre: 'Infraestructura Digital SA', cuit: '30-71234568-1', contacto: 'Maria Lopez', email: 'maria@infradigital.com', telefono: '11-4567-8902', ocsActivas: 2, activo: true },
  { id: '3', nombre: 'CloudNet Argentina', cuit: '30-71234569-2', contacto: 'Juan Perez', email: 'juan@cloudnet.ar', telefono: '11-4567-8903', ocsActivas: 1, activo: true },
  { id: '4', nombre: 'DataServ Consultores', cuit: '30-71234570-3', contacto: 'Ana Garcia', email: 'ana@dataserv.com', telefono: '11-4567-8904', ocsActivas: 0, activo: true },
  { id: '5', nombre: 'Redes Seguras SRL', cuit: '30-71234571-4', contacto: 'Pablo Martinez', email: 'pablo@redesseguras.com', telefono: '11-4567-8905', ocsActivas: 2, activo: false },
];

export const mockOrdenes: OrdenCompra[] = [
  { id: '1', numero: 'OC-2026-001', proveedorId: '1', proveedorNombre: 'Tech Solutions SRL', descripcion: 'Licencias Microsoft 365 - 50 usuarios', monto: 450000, fechaEmision: '2026-02-10', fechaEntrega: '2026-03-01', estado: 'EN_SEGUIMIENTO' },
  { id: '2', numero: 'OC-2026-002', proveedorId: '2', proveedorNombre: 'Infraestructura Digital SA', descripcion: 'Servidores Dell PowerEdge x3', monto: 2800000, fechaEmision: '2026-02-12', fechaEntrega: '2026-03-15', estado: 'ACEPTADA' },
  { id: '3', numero: 'OC-2026-003', proveedorId: '1', proveedorNombre: 'Tech Solutions SRL', descripcion: 'Soporte tecnico anual', monto: 180000, fechaEmision: '2026-02-15', fechaEntrega: '2026-02-28', estado: 'EMITIDA' },
  { id: '4', numero: 'OC-2026-004', proveedorId: '3', proveedorNombre: 'CloudNet Argentina', descripcion: 'Migracion a AWS - Fase 1', monto: 1500000, fechaEmision: '2026-01-20', fechaEntrega: '2026-02-20', estado: 'ENTREGA_CONFIRMADA' },
  { id: '5', numero: 'OC-2026-005', proveedorId: '5', proveedorNombre: 'Redes Seguras SRL', descripcion: 'Auditoria de seguridad perimetral', monto: 350000, fechaEmision: '2026-02-01', fechaEntrega: '2026-02-22', estado: 'NO_ACEPTADA' },
  { id: '6', numero: 'OC-2026-006', proveedorId: '2', proveedorNombre: 'Infraestructura Digital SA', descripcion: 'Cableado estructurado piso 3', monto: 620000, fechaEmision: '2026-01-15', fechaEntrega: '2026-02-10', estado: 'INCUMPLIMIENTO' },
  { id: '7', numero: 'OC-2026-007', proveedorId: '4', proveedorNombre: 'DataServ Consultores', descripcion: 'Consultoria BI - Tableros Power BI', monto: 290000, fechaEmision: '2026-01-10', fechaEntrega: '2026-02-05', estado: 'VALIDADA_CLIENTE' },
  { id: '8', numero: 'OC-2026-008', proveedorId: '1', proveedorNombre: 'Tech Solutions SRL', descripcion: 'Notebooks Lenovo ThinkPad x10', monto: 3200000, fechaEmision: '2026-01-05', fechaEntrega: '2026-01-30', estado: 'CERRADA' },
  { id: '9', numero: 'OC-2026-009', proveedorId: '3', proveedorNombre: 'CloudNet Argentina', descripcion: 'Servicio de backup en la nube - 1TB', monto: 95000, fechaEmision: '2026-02-20', fechaEntrega: '2026-03-10', estado: 'EMITIDA' },
  { id: '10', numero: 'OC-2026-010', proveedorId: '5', proveedorNombre: 'Redes Seguras SRL', descripcion: 'Firewall FortiGate 200F', monto: 1850000, fechaEmision: '2026-02-18', fechaEntrega: '2026-03-20', estado: 'ACEPTADA' },
];

export const mockUsuarios: Usuario[] = [
  { id: '1', nombre: 'Fernando Arambarri', email: 'farambarri@gmail.com', rol: 'admin' },
  { id: '2', nombre: 'Laura Gomez', email: 'laura@snoop.com.ar', rol: 'admin' },
  { id: '3', nombre: 'Carlos Mendez', email: 'carlos@techsolutions.com', rol: 'proveedor', proveedorId: '1', proveedorNombre: 'Tech Solutions SRL' },
  { id: '4', nombre: 'Sofia Ruiz', email: 'sofia@techsolutions.com', rol: 'proveedor', proveedorId: '1', proveedorNombre: 'Tech Solutions SRL' },
  { id: '5', nombre: 'Maria Lopez', email: 'maria@infradigital.com', rol: 'proveedor', proveedorId: '2', proveedorNombre: 'Infraestructura Digital SA' },
  { id: '6', nombre: 'Juan Perez', email: 'juan@cloudnet.ar', rol: 'proveedor', proveedorId: '3', proveedorNombre: 'CloudNet Argentina' },
];

export const mockAlertas: Alerta[] = [
  { id: '1', tipo: 'roja', mensaje: 'OC no aceptada - superadas 24hs', ocNumero: 'OC-2026-005', proveedor: 'Redes Seguras SRL', fecha: '2026-02-23' },
  { id: '2', tipo: 'roja', mensaje: 'Incumplimiento de entrega', ocNumero: 'OC-2026-006', proveedor: 'Infraestructura Digital SA', fecha: '2026-02-22' },
  { id: '3', tipo: 'amarilla', mensaje: 'Entrega en 7 dias (T-7)', ocNumero: 'OC-2026-001', proveedor: 'Tech Solutions SRL', fecha: '2026-02-22' },
  { id: '4', tipo: 'amarilla', mensaje: 'Entrega manana (T-1)', ocNumero: 'OC-2026-003', proveedor: 'Tech Solutions SRL', fecha: '2026-02-27' },
  { id: '5', tipo: 'verde', mensaje: 'Entrega confirmada por proveedor', ocNumero: 'OC-2026-004', proveedor: 'CloudNet Argentina', fecha: '2026-02-21' },
  { id: '6', tipo: 'verde', mensaje: 'OC validada por cliente interno', ocNumero: 'OC-2026-007', proveedor: 'DataServ Consultores', fecha: '2026-02-20' },
];

export function formatMonto(monto: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(monto);
}

export function formatFecha(fecha: string): string {
  return new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
