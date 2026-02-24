import { useState } from 'react';
import { ESTADO_LABELS, ESTADO_BADGE } from '../../constants/site';
import { mockOrdenes, formatMonto, formatFecha } from '../../mocks/data';
import styles from './MisOrdenesPage.module.css';

export default function MisOrdenesPage() {
  // Mock: show OCs for provider id "1" (Tech Solutions SRL)
  const misOrdenes = mockOrdenes.filter((oc) => oc.proveedorId === '1');
  const [confirmadas, setConfirmadas] = useState<Set<string>>(new Set());

  const handleAccion = (ocId: string) => {
    setConfirmadas((prev) => new Set(prev).add(ocId));
  };

  const getAccionLabel = (estado: string): string | null => {
    switch (estado) {
      case 'EMITIDA': return 'Aceptar OC';
      case 'EN_SEGUIMIENTO': return 'Confirmar Entrega';
      default: return null;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Mis Ordenes de Compra</h1>
        <p className={styles.pageSubtitle}>
          {misOrdenes.length} orden{misOrdenes.length !== 1 ? 'es' : ''} asignada{misOrdenes.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className={styles.cardGrid}>
        {misOrdenes.map((oc) => {
          const accion = getAccionLabel(oc.estado);
          const yaConfirmada = confirmadas.has(oc.id);

          return (
            <div key={oc.id} className={styles.ocCard}>
              <div className={styles.ocCardHeader}>
                <span className={styles.ocNumero}>{oc.numero}</span>
                <span className={`badge ${ESTADO_BADGE[oc.estado]}`}>
                  {ESTADO_LABELS[oc.estado]}
                </span>
              </div>

              <p className={styles.ocDescripcion}>{oc.descripcion}</p>

              <div className={styles.ocDetails}>
                <div className={styles.ocDetail}>
                  <span className={styles.ocDetailLabel}>Monto</span>
                  <span className={styles.ocDetailValue}>{formatMonto(oc.monto)}</span>
                </div>
                <div className={styles.ocDetail}>
                  <span className={styles.ocDetailLabel}>Fecha Entrega</span>
                  <span className={styles.ocDetailValue}>{formatFecha(oc.fechaEntrega)}</span>
                </div>
              </div>

              {accion && !yaConfirmada && (
                <button
                  className={`btn-primary ${styles.actionBtn}`}
                  onClick={() => handleAccion(oc.id)}
                >
                  {accion}
                </button>
              )}

              {yaConfirmada && (
                <div className={styles.confirmado}>Confirmado</div>
              )}
            </div>
          );
        })}
      </div>

      {misOrdenes.length === 0 && (
        <div className={styles.empty}>
          No tienes ordenes de compra asignadas en este momento.
        </div>
      )}
    </div>
  );
}
