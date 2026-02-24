# Especificacion Funcional y Arquitectonica: Portal de Seguimiento Snoop

## 1. Descripcion Funcional (El "Que")

El sistema es un gestor de compromisos entre Snoop Consulting y sus proveedores. Su objetivo es eliminar la incertidumbre en las fechas de entrega mediante un flujo de validaciones obligatorias.

### El Flujo Critico de la Orden de Compra (OC):

1. **Hito de Aceptacion (24hs):** Al emitirse la OC, el proveedor tiene 24hs para aceptarla formalmente en el portal. Si no lo hace, el sistema dispara una Alerta Roja al equipo de Compras.

2. **Ventana de Seguimiento (T-7, T-1, T-0):** El sistema actua como un "reloj biologico" enviando recordatorios automaticos 7 dias antes, 1 dia antes y el mismo dia de la entrega pactada, exigiendo confirmacion en cada paso.

3. **Cierre de Ciclo (T+1):** Un dia despues de la fecha pactada, el sistema pregunta al proveedor si entrego.
   - **Si responde SI:** El sistema busca la validacion del Cliente Interno (quien solicito el servicio/producto) para cerrar la OC.
   - **Si responde NO o no responde:** Se escala inmediatamente a Compras como Incumplimiento.

## 2. Modelo de Aplicaciones Separadas

Se definen dos experiencias de usuario (Frontends) sobre una misma base de datos, consumiendo una API centralizada:

### Portal de Administracion (Interno Snoop):
- **Perfil:** Compras y Gestion.
- **Uso:** Dashboard de control, gestion de alertas (semaforos), carga de OCs y administracion de usuarios.
- **Estetica:** Layout de panel de control, color Rojo Snoop (#E30613) en cabeceras y acciones principales.

### Portal de Proveedores (Externo):
- **Perfil:** Proveedores activos.
- **Uso:** Vista simplificada de OCs pendientes de accion. Interfaz "al grano" para confirmar hitos con un clic.
- **Estetica:** Limpia, enfocada en la legibilidad y rapidez de respuesta.

## 3. Stack de Referencia
- **Frontend:** React (SPA) con React Router para la separacion de portales (/admin vs /providers).
- **Backend:** NestJS como orquestador de logica y seguridad.
- **Base de Datos & Auth:** Supabase (PostgreSQL). Se delega en Supabase la gestion de usuarios y la persistencia de datos.

## 4. Logica de Escalamiento y Notificaciones

La arquitectura debe incluir un Servicio de Tareas Programadas (Cron) que audite el estado de las OCs constantemente:

- **Regla de Oro:** "Toda falta de accion del proveedor es una alerta para Snoop".
- **Validacion Cruzada:** Una entrega no se considera "Exitosa" solo con la palabra del proveedor; requiere el "OK" del Cliente Interno de Snoop.

## 5. Branding

- **Color corporativo:** Rojo Snoop (#E30613)
- **Prioridades:** Seguridad por roles y sistema de alertas para el area de Compras ante falta de confirmaciones.

## 6. Estados de una Orden de Compra

```
EMITIDA -> ACEPTADA -> EN_SEGUIMIENTO -> ENTREGA_CONFIRMADA -> VALIDADA_CLIENTE -> CERRADA
                                      -> INCUMPLIMIENTO
       -> NO_ACEPTADA (alerta roja)
```

### Detalle de estados:
| Estado | Descripcion | Trigger |
|--------|------------|---------|
| EMITIDA | OC recien creada, esperando aceptacion del proveedor | Creacion de OC |
| ACEPTADA | Proveedor acepto la OC dentro de las 24hs | Accion del proveedor |
| NO_ACEPTADA | Proveedor no acepto en 24hs | Cron (alerta roja) |
| EN_SEGUIMIENTO | OC en ventana T-7 a T-0, con recordatorios activos | Automatico |
| ENTREGA_CONFIRMADA | Proveedor confirma que entrego (T+1) | Accion del proveedor |
| VALIDADA_CLIENTE | Cliente interno confirma recepcion | Accion del cliente interno |
| CERRADA | OC completada exitosamente | Validacion cruzada OK |
| INCUMPLIMIENTO | Proveedor no entrego o no respondio | Cron / respuesta negativa |
