import { useState, useMemo } from 'react';
import { FiAlertCircle, FiInfo } from 'react-icons/fi';
import { ESTADO_LABELS, ESTADO_BADGE, type EstadoOC } from '../../constants/site';
import DataTable, { type Column } from '../../components/DataTable/DataTable';
import { mockOrdenes, mockAlertas, formatMonto, formatFecha, type OrdenCompra, type Alerta } from '../../mocks/data';
import styles from './DashboardPage.module.css';

const alertaColumns: Column<Alerta>[] = [
  {
    key: 'mensaje',
    label: 'Alerta',
    render: (row) => (
      <div className={`${styles.alertRow} ${row.tipo === 'roja' ? styles.alertCritical : ''}`}>
        {row.tipo === 'roja' ? <FiAlertCircle className={styles.alertIcon} /> : <FiInfo className={styles.alertIcon} />}
        <span className={styles.alertText}>{row.mensaje}</span>
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
  const [activeFilter, setActiveFilter] = useState<EstadoOC | null>(null);

  const totalOCs = mockOrdenes.length;
  const pendientes = mockOrdenes.filter((o) => o.estado === 'EMITIDA').length;
  const enSeguimiento = mockOrdenes.filter((o) => o.estado === 'EN_SEGUIMIENTO').length;
  const alertasRojas = mockAlertas.filter((a) => a.tipo === 'roja').length;

  const filteredOCs = useMemo(() => {
    if (!activeFilter) return mockOrdenes.slice(0, 5);
    return mockOrdenes.filter(oc => oc.estado === activeFilter);
  }, [activeFilter]);

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

      {/* KPI Grid */}
      <div className={styles.kpiGrid}>
        <div
          className={`${styles.kpiCard} ${styles.info} ${!activeFilter ? styles.active : ''}`}
          onClick={() => setActiveFilter(null)}
        >
          <span className={styles.kpiLabel}>Total OCs</span>
          <span className={styles.kpiValue}>{totalOCs}</span>
        </div>
        <div
          className={`${styles.kpiCard} ${styles.warning} ${activeFilter === 'EMITIDA' ? styles.active : ''}`}
          onClick={() => setActiveFilter('EMITIDA')}
        >
          <span className={styles.kpiLabel}>Pendientes</span>
          <span className={styles.kpiValue}>{pendientes}</span>
        </div>
        <div
          className={`${styles.kpiCard} ${styles.success} ${activeFilter === 'EN_SEGUIMIENTO' ? styles.active : ''}`}
          onClick={() => setActiveFilter('EN_SEGUIMIENTO')}
        >
          <span className={styles.kpiLabel}>Seguimiento</span>
          <span className={styles.kpiValue}>{enSeguimiento}</span>
        </div>
        <div
          className={`${styles.kpiCard} ${styles.danger} ${activeFilter === 'INCUMPLIMIENTO' ? styles.active : ''}`}
          onClick={() => setActiveFilter('INCUMPLIMIENTO')}
        >
          <span className={styles.kpiLabel}>Incidentes</span>
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
            <div className={styles.semaforoLabel}>Atencion</div>
          </div>
          <div className={styles.semaforoCard}>
            <div className={`${styles.semaforoIndicator} ${styles.rojo}`} />
            <div className={styles.semaforoCount}>{semaforoData.rojo}</div>
            <div className={styles.semaforoLabel}>Criticas</div>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Alertas Recientes */}
        <div className={styles.tableSection}>
          <h2 className={styles.tableTitle}>Alertas Criticas</h2>
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
          <div className={styles.tableHeaderRow}>
            <h2 className={styles.tableTitle}>
              {activeFilter ? `OCs: ${ESTADO_LABELS[activeFilter as keyof typeof ESTADO_LABELS]}` : 'Ordenes Recientes'}
            </h2>
            {activeFilter && (
              <button className={styles.clearFilter} onClick={() => setActiveFilter(null)}>
                Ver todas
              </button>
            )}
          </div>
          <DataTable
            columns={ocColumns}
            data={filteredOCs}
            keyField="id"
            searchPlaceholder="Filtrar ordenes..."
            defaultPageSize={5}
            pageSizes={[5, 10]}
          />
        </div>
      </div>
    </div>
  );
}
