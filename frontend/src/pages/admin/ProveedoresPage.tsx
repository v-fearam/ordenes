import { mockProveedores } from '../../mocks/data';
import styles from './ProveedoresPage.module.css';

export default function ProveedoresPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Proveedores</h1>
          <p className={styles.pageSubtitle}>{mockProveedores.length} proveedores registrados</p>
        </div>
        <button className="btn-primary">+ Nuevo Proveedor</button>
      </div>

      <div className={styles.tableCard}>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>CUIT</th>
              <th>Contacto</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>OCs Activas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {mockProveedores.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.nombre}</td>
                <td>{p.cuit}</td>
                <td>{p.contacto}</td>
                <td>{p.email}</td>
                <td>{p.telefono}</td>
                <td>{p.ocsActivas}</td>
                <td>
                  <span className={`badge ${p.activo ? 'badge-success' : 'badge-neutral'}`}>
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
