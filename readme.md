# Portal de Seguimiento Snoop - Prototipo UI/UX

Este proyecto es un prototipo funcional del sistema de gestión de compromisos entre Snoop Consulting y sus proveedores. El objetivo principal es garantizar el cumplimiento de los hitos de entrega mediante un flujo de validaciones y alertas.

## 🚀 Tecnologías
- **Frontend**: React (Vite)
- **Estética**: CSS Modules + Design System (Slate & Crimson)
- **Iconos**: React Icons (Feather)
- **Responsividad**: Mobile-First (Drawer Navigation, Card Views)

## 🏢 Estructura de Portales

### 1. Panel de Administración (`/admin`)
Diseñado para el equipo de Compras y Gestión interna de Snoop.
- **Dashboard Interactivo**: KPIs con filtrado dinámico. Haz clic en las tarjetas de "Pendientes" o "Incidentes" para filtrar la tabla principal.
- **Semáforo de Estado**: Visualización rápida de la salud de las operaciones.
- **Gestión de OCs**: Listado completo con acciones de edición, eliminación y **Validación de Cliente**.

### 2. Portal de Proveedores (`/portal`)
Vista simplificada y "al grano" para los proveedores externos.
- **Mis Órdenes**: Vista de tarjetas optimizada para móviles.
- **Acciones Rápidas**: Botón de "Aceptar OC" e "Informar Entrega" con un solo clic.

## 🔄 El Flujo del Prototipo (Cómo Probarlo)

El sistema simula el ciclo de vida completo definido en los requerimientos técnicos:

1.  **Aceptación (24hs)**: 
    - Entra al **Portal de Proveedores**. Una OC en estado `EMITIDA` mostrará el botón "Aceptar OC".
    - Si no se acepta a tiempo, verás una **Alerta Roja** en el Dashboard Administrativo.
2.  **Seguimiento (T-7 a T-0)**:
    - Las OCs en seguimiento activan alertas amarillas automáticas (representadas en el Dashboard).
3.  **Confirmación de Entrega**:
    - El proveedor informa la entrega desde su portal (Estado: `ENTREGA_CONFIRMADA`).
4.  **Validación Interna (Hito Crítico)**:
    - Ve al **Portal Administrativo -> Órdenes**.
    - Las OCs confirmadas por el proveedor mostrarán un icono de "Check" (Validar). Al pulsarlo, el estado cambia a `VALIDADA_CLIENTE`.
5.  **Cierre**:
    - Al validar nuevamente una orden validada por el cliente, esta se marca como `CERRADA`.

## 📱 Responsividad
Para probar la experiencia móvil:
- Reduce el ancho del navegador o usa las DevTools (F12).
- En mobile, aparecerá un **Drawer (Hamburgesa)** para la navegación.
- Las tablas de datos del administrador se transforman en una **Vista de Tarjetas** para evitar el scroll horizontal.

## 🛠️ Ejecución Local
```bash
cd frontend
npm install
npm run dev
```
Acceso: [http://localhost:5173](http://localhost:5173)
