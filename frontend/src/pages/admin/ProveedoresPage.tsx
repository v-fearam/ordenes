import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import DataTable, { type Column } from '../../components/DataTable/DataTable';
import Modal, { modalStyles } from '../../components/Modal/Modal';
import { mockProveedores as initialProveedores, type Proveedor } from '../../mocks/data';
import styles from './ProveedoresPage.module.css';

interface ProveedorForm {
  nombre: string;
  cuit: string;
  contacto: string;
  email: string;
  telefono: string;
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>(initialProveedores);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProv, setEditingProv] = useState<Proveedor | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProveedorForm>();

  const openCreate = useCallback(() => {
    setEditingProv(null);
    reset({ nombre: '', cuit: '', contacto: '', email: '', telefono: '' });
    setModalOpen(true);
  }, [reset]);

  const openEdit = useCallback((prov: Proveedor) => {
    setEditingProv(prov);
    reset({
      nombre: prov.nombre,
      cuit: prov.cuit,
      contacto: prov.contacto,
      email: prov.email,
      telefono: prov.telefono,
    });
    setModalOpen(true);
  }, [reset]);

  const handleDelete = useCallback((id: string) => {
    setProveedores((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const onSubmit = (data: ProveedorForm) => {
    if (editingProv) {
      setProveedores((prev) =>
        prev.map((p) =>
          p.id === editingProv.id ? { ...p, ...data } : p,
        ),
      );
    } else {
      const newProv: Proveedor = {
        id: String(Date.now()),
        ...data,
        ocsActivas: 0,
        activo: true,
      };
      setProveedores((prev) => [...prev, newProv]);
    }
    setModalOpen(false);
  };

  const columns: Column<Proveedor>[] = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.nombre}</span>,
    },
    { key: 'cuit', label: 'CUIT' },
    { key: 'contacto', label: 'Contacto' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Telefono' },
    {
      key: 'ocsActivas',
      label: 'OCs Activas',
      getValue: (row) => row.ocsActivas,
    },
    {
      key: 'activo',
      label: 'Estado',
      getValue: (row) => (row.activo ? 'Activo' : 'Inactivo'),
      render: (row) => (
        <span className={`badge ${row.activo ? 'badge-success' : 'badge-neutral'}`}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      sortable: false,
      render: (row) => (
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={() => openEdit(row)}>
            Editar
          </button>
          <button className={styles.deleteBtn} onClick={() => handleDelete(row.id)}>
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Proveedores</h1>
          <p className={styles.pageSubtitle}>{proveedores.length} proveedores registrados</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Nuevo Proveedor</button>
      </div>

      <DataTable
        columns={columns}
        data={proveedores}
        keyField="id"
        searchPlaceholder="Buscar por nombre, CUIT o contacto..."
        defaultPageSize={10}
        pageSizes={[5, 10, 20]}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProv ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleSubmit(onSubmit)}>
              {editingProv ? 'Guardar Cambios' : 'Crear Proveedor'}
            </button>
          </>
        }
      >
        <form className={modalStyles.formGrid} onSubmit={handleSubmit(onSubmit)}>
          <div className={modalStyles.formField}>
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              placeholder="Nombre de la empresa"
              {...register('nombre', { required: true })}
              style={errors.nombre ? { borderColor: 'var(--color-danger)' } : undefined}
            />
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formField}>
              <label htmlFor="cuit">CUIT</label>
              <input
                id="cuit"
                type="text"
                placeholder="30-12345678-9"
                {...register('cuit', { required: true })}
                style={errors.cuit ? { borderColor: 'var(--color-danger)' } : undefined}
              />
            </div>
            <div className={modalStyles.formField}>
              <label htmlFor="contacto">Contacto</label>
              <input
                id="contacto"
                type="text"
                placeholder="Nombre del contacto"
                {...register('contacto', { required: true })}
                style={errors.contacto ? { borderColor: 'var(--color-danger)' } : undefined}
              />
            </div>
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formField}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="contacto@empresa.com"
                {...register('email', { required: true })}
                style={errors.email ? { borderColor: 'var(--color-danger)' } : undefined}
              />
            </div>
            <div className={modalStyles.formField}>
              <label htmlFor="telefono">Telefono</label>
              <input
                id="telefono"
                type="text"
                placeholder="11-1234-5678"
                {...register('telefono')}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
