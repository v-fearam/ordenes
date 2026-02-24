import { useState } from 'react';
import { FiPackage, FiTruck, FiCheckCircle, FiInfo, FiClock } from 'react-icons/fi';
import { ESTADO_LABELS, ESTADO_BADGE, type EstadoOC } from '../../constants/site';
import { useAuth } from '../../context/AuthContext';
import { mockOrdenes, formatMonto, formatFecha } from '../../mocks/data';
import styles from './MisOrdenesPage.module.css';

const ACCION_CONFIG: Partial<Record<EstadoOC, { label: string; nextEstado: EstadoOC; confirmMsg: string; icon: any }>> = {
  EMITIDA: { label: 'Aceptar OC', nextEstado: 'ACEPTADA', confirmMsg: 'OC aceptada exitosamente', icon: FiCheckCircle },
  EN_SEGUIMIENTO: { label: 'Confirmar Entrega', nextEstado: 'ENTREGA_CONFIRMADA', confirmMsg: 'Entrega confirmada', icon: FiTruck },
};

export default function MisOrdenesPage() {
  const { user } = useAuth();
  const [estadosLocales, setEstadosLocales] = useState<Record<string, EstadoOC>>({});
  const [mensajes, setMensajes] = useState<Record<string, string>>({});

  const misOrdenes = mockOrdenes.filter((oc) => oc.proveedorId === user?.proveedorId);

  const handleAccion = (ocId: string, nextEstado: EstadoOC, confirmMsg: string) => {
    setEstadosLocales((prev) => ({ ...prev, [ocId]: nextEstado }));
    setMensajes((prev) => ({ ...prev, [ocId]: confirmMsg }));
    setTimeout(() => {
      setMensajes((prev) => {
        const next = { ...prev };
        delete next[ocId];
        return next;
      });
    }, 3000);
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
          const estadoActual = estadosLocales[oc.id] ?? oc.estado;
          const accionConfig = ACCION_CONFIG[estadoActual];
          const mensaje = mensajes[oc.id];

          return (
            <div key={oc.id} className={styles.ocCard}>
              <div className={styles.ocCardHeader}>
                <div className={styles.ocHeaderTitle}>
                  <FiPackage className={styles.ocIcon} />
                  <span className={styles.ocNumero}>{oc.numero}</span>
                </div>
                <span className={`badge ${ESTADO_BADGE[estadoActual]}`}>
                  {ESTADO_LABELS[estadoActual]}
                </span>
              </div>

              <div className={styles.ocBody}>
                <p className={styles.ocDescripcion}>{oc.descripcion}</p>

                <div className={styles.ocDetails}>
                  <div className={styles.ocDetail}>
                    <FiInfo className={styles.detailIcon} />
                    <div>
                      <span className={styles.ocDetailLabel}>Monto</span>
                      <span className={styles.ocDetailValue}>{formatMonto(oc.monto)}</span>
                    </div>
                  </div>
                  <div className={styles.ocDetail}>
                    <FiClock className={styles.detailIcon} />
                    <div>
                      <span className={styles.ocDetailLabel}>Fecha Entrega</span>
                      <span className={styles.ocDetailValue}>{formatFecha(oc.fechaEntrega)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {mensaje && (
                <div className={styles.confirmado}>
                  <FiCheckCircle size={18} />
                  <span>{mensaje}</span>
                </div>
              )}

              {accionConfig && !mensaje && (
                <button
                  className={`btn-primary ${styles.actionBtn}`}
                  onClick={() => handleAccion(oc.id, accionConfig.nextEstado, accionConfig.confirmMsg)}
                >
                  <accionConfig.icon className={styles.btnIcon} />
                  <span>{accionConfig.label}</span>
                </button>
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
