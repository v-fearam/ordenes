import { ESTADO_LABELS, ESTADO_BADGE } from '../../constants/site';
import { mockOrdenes, mockAlertas, formatMonto, formatFecha } from '../../mocks/data';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const totalOCs = mockOrdenes.length;
  const pendientes = mockOrdenes.filter((o) => o.estado === 'EMITIDA').length;
  const enSeguimiento = mockOrdenes.filter((o) => o.estado === 'EN_SEGUIMIENTO').length;
  const alertasRojas = mockAlertas.filter((a) => a.tipo === 'roja').length;

  const semaforoData = {
    verde: mockAlertas.filter((a) => a.tipo === 'verde').length,
    amarillo: mockAlertas.filter((a) => a.tipo === 'amarilla').length,
    rojo: mockAlertas.filter((a) => a.tipo === 'roja').length,
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Resumen general de ordenes de compra</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.info}`}>
          <span className={styles.kpiLabel}>Total OCs</span>
          <span className={styles.kpiValue}>{totalOCs}</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.warning}`}>
          <span className={styles.kpiLabel}>Pendientes de Aceptacion</span>
          <span className={styles.kpiValue}>{pendientes}</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.success}`}>
          <span className={styles.kpiLabel}>En Seguimiento</span>
          <span className={styles.kpiValue}>{enSeguimiento}</span>
        </div>
        <div className={`${styles.kpiCard} ${styles.danger}`}>
          <span className={styles.kpiLabel}>Alertas Rojas</span>
          <span className={styles.kpiValue}>{alertasRojas}</span>
        </div>
      </div>

      {/* Semaforo */}
      <div className={styles.semaforoSection}>
        <h2 className={styles.semaforoTitle}>Semaforo de Estado</h2>
        <div className={styles.semaforoGrid}>
          <div className={styles.semaforoCard}>
            <div className={`${styles.semaforoIndicator} ${styles.verde}`} />
            <div className={styles.semaforoCount}>{semaforoData.verde}</div>
            <div className={styles.semaforoLabel}>En orden</div>
          </div>
          <div className={styles.semaforoCard}>
            <div className={`${styles.semaforoIndicator} ${styles.amarillo}`} />
            <div className={styles.semaforoCount}>{semaforoData.amarillo}</div>
            <div className={styles.semaforoLabel}>Requieren atencion</div>
          </div>
          <div className={styles.semaforoCard}>
            <div className={`${styles.semaforoIndicator} ${styles.rojo}`} />
            <div className={styles.semaforoCount}>{semaforoData.rojo}</div>
            <div className={styles.semaforoLabel}>Criticas</div>
          </div>
        </div>
      </div>

      {/* Alertas Recientes */}
      <div className={styles.tableSection}>
        <div className={styles.tableSectionHeader}>
          <h2 className={styles.tableTitle}>Alertas Recientes</h2>
        </div>
        <div className={styles.tableCard}>
          <table>
            <thead>
              <tr>
                <th>Alerta</th>
                <th>OC</th>
                <th>Proveedor</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {mockAlertas.map((alerta) => (
                <tr key={alerta.id}>
                  <td>
                    <div className={styles.alertRow}>
                      <span className={`${styles.alertDot} ${styles[alerta.tipo]}`} />
                      {alerta.mensaje}
                    </div>
                  </td>
                  <td>{alerta.ocNumero}</td>
                  <td>{alerta.proveedor}</td>
                  <td>{formatFecha(alerta.fecha)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OCs Recientes */}
      <div className={styles.tableSection}>
        <div className={styles.tableSectionHeader}>
          <h2 className={styles.tableTitle}>Ordenes de Compra Recientes</h2>
        </div>
        <div className={styles.tableCard}>
          <table>
            <thead>
              <tr>
                <th>Numero</th>
                <th>Proveedor</th>
                <th>Descripcion</th>
                <th>Monto</th>
                <th>Entrega</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockOrdenes.slice(0, 8).map((oc) => (
                <tr key={oc.id}>
                  <td style={{ fontWeight: 600 }}>{oc.numero}</td>
                  <td>{oc.proveedorNombre}</td>
                  <td>{oc.descripcion}</td>
                  <td>{formatMonto(oc.monto)}</td>
                  <td>{formatFecha(oc.fechaEntrega)}</td>
                  <td>
                    <span className={`badge ${ESTADO_BADGE[oc.estado]}`}>
                      {ESTADO_LABELS[oc.estado]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
