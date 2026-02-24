import { ESTADO_LABELS, ESTADO_BADGE } from '../../constants/site';
import DataTable, { type Column } from '../../components/DataTable/DataTable';
import { mockOrdenes, mockAlertas, formatMonto, formatFecha, type OrdenCompra, type Alerta } from '../../mocks/data';
import styles from './DashboardPage.module.css';

const alertaColumns: Column<Alerta>[] = [
  {
    key: 'mensaje',
    label: 'Alerta',
    render: (row) => (
      <div className={styles.alertRow}>
        <span className={`${styles.alertDot} ${styles[row.tipo]}`} />
        {row.mensaje}
      </div>
    ),
  },
  { key: 'ocNumero', label: 'OC' },
  { key: 'proveedor', label: 'Proveedor' },
  {
    key: 'fecha',
    label: 'Fecha',
    getValue: (row) => row.fecha,
    render: (row) => formatFecha(row.fecha),
  },
];

const ocColumns: Column<OrdenCompra>[] = [
  {
    key: 'numero',
    label: 'Numero',
    render: (row) => <span style={{ fontWeight: 600 }}>{row.numero}</span>,
  },
  { key: 'proveedorNombre', label: 'Proveedor' },
  { key: 'descripcion', label: 'Descripcion' },
  {
    key: 'monto',
    label: 'Monto',
    getValue: (row) => row.monto,
    render: (row) => formatMonto(row.monto),
  },
  {
    key: 'fechaEntrega',
    label: 'Entrega',
    getValue: (row) => row.fechaEntrega,
    render: (row) => formatFecha(row.fechaEntrega),
  },
  {
    key: 'estado',
    label: 'Estado',
    getValue: (row) => ESTADO_LABELS[row.estado],
    render: (row) => (
      <span className={`badge ${ESTADO_BADGE[row.estado]}`}>
        {ESTADO_LABELS[row.estado]}
      </span>
    ),
  },
];

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
        <h2 className={styles.tableTitle}>Alertas Recientes</h2>
        <DataTable
          columns={alertaColumns}
          data={mockAlertas}
          keyField="id"
          searchPlaceholder="Buscar alertas..."
          defaultPageSize={5}
          pageSizes={[5, 10]}
        />
      </div>

      {/* OCs Recientes */}
      <div className={styles.tableSection}>
        <h2 className={styles.tableTitle}>Ordenes de Compra Recientes</h2>
        <DataTable
          columns={ocColumns}
          data={mockOrdenes}
          keyField="id"
          searchPlaceholder="Buscar ordenes..."
          defaultPageSize={5}
          pageSizes={[5, 10]}
        />
      </div>
    </div>
  );
}
