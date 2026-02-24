import { useState } from 'react';
import { ESTADO_OC, ESTADO_LABELS, ESTADO_BADGE, type EstadoOC } from '../../constants/site';
import { mockOrdenes, formatMonto, formatFecha } from '../../mocks/data';
import styles from './OrdenesPage.module.css';

export default function OrdenesPage() {
  const [filtroEstado, setFiltroEstado] = useState<EstadoOC | ''>('');
  const [busqueda, setBusqueda] = useState('');

  const ordenesFiltradas = mockOrdenes.filter((oc) => {
    if (filtroEstado && oc.estado !== filtroEstado) return false;
    if (busqueda) {
      const q = busqueda.toLowerCase();
      return (
        oc.numero.toLowerCase().includes(q) ||
        oc.proveedorNombre.toLowerCase().includes(q) ||
        oc.descripcion.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Ordenes de Compra</h1>
          <p className={styles.pageSubtitle}>
            {ordenesFiltradas.length} orden{ordenesFiltradas.length !== 1 ? 'es' : ''} encontrada{ordenesFiltradas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-primary">+ Nueva OC</button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar por numero, proveedor o descripcion..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as EstadoOC | '')}
          className={styles.selectFilter}
        >
          <option value="">Todos los estados</option>
          {Object.values(ESTADO_OC).map((estado) => (
            <option key={estado} value={estado}>
              {ESTADO_LABELS[estado]}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <table>
          <thead>
            <tr>
              <th>Numero</th>
              <th>Proveedor</th>
              <th>Descripcion</th>
              <th>Monto</th>
              <th>Emision</th>
              <th>Entrega</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ordenesFiltradas.map((oc) => (
              <tr key={oc.id}>
                <td style={{ fontWeight: 600 }}>{oc.numero}</td>
                <td>{oc.proveedorNombre}</td>
                <td className={styles.descCell}>{oc.descripcion}</td>
                <td>{formatMonto(oc.monto)}</td>
                <td>{formatFecha(oc.fechaEmision)}</td>
                <td>{formatFecha(oc.fechaEntrega)}</td>
                <td>
                  <span className={`badge ${ESTADO_BADGE[oc.estado]}`}>
                    {ESTADO_LABELS[oc.estado]}
                  </span>
                </td>
              </tr>
            ))}
            {ordenesFiltradas.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.emptyRow}>
                  No se encontraron ordenes con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
