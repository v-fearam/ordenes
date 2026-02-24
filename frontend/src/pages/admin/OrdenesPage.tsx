import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ESTADO_OC, ESTADO_LABELS, ESTADO_BADGE, type EstadoOC } from '../../constants/site';
import DataTable, { type Column } from '../../components/DataTable/DataTable';
import Modal, { modalStyles } from '../../components/Modal/Modal';
import { mockOrdenes as initialOrdenes, mockProveedores, formatMonto, formatFecha, type OrdenCompra } from '../../mocks/data';
import styles from './OrdenesPage.module.css';

interface OCForm {
  proveedorId: string;
  descripcion: string;
  monto: string;
  fechaEmision: string;
  fechaEntrega: string;
  estado: EstadoOC;
  observaciones: string;
}

let nextOCNumber = 11;

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>(initialOrdenes);
  const [filtroEstado, setFiltroEstado] = useState<EstadoOC | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOC, setEditingOC] = useState<OrdenCompra | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OCForm>();

  const ordenesFiltradas = useMemo(
    () => filtroEstado ? ordenes.filter((oc) => oc.estado === filtroEstado) : ordenes,
    [filtroEstado, ordenes],
  );

  const openCreate = useCallback(() => {
    setEditingOC(null);
    const today = new Date().toISOString().split('T')[0];
    reset({ proveedorId: '', descripcion: '', monto: '', fechaEmision: today, fechaEntrega: '', estado: 'EMITIDA', observaciones: '' });
    setModalOpen(true);
  }, [reset]);

  const openEdit = useCallback((oc: OrdenCompra) => {
    setEditingOC(oc);
    reset({
      proveedorId: oc.proveedorId,
      descripcion: oc.descripcion,
      monto: String(oc.monto),
      fechaEmision: oc.fechaEmision,
      fechaEntrega: oc.fechaEntrega,
      estado: oc.estado,
      observaciones: oc.observaciones ?? '',
    });
    setModalOpen(true);
  }, [reset]);

  const handleDelete = useCallback((id: string) => {
    setOrdenes((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const onSubmit = (data: OCForm) => {
    const proveedor = mockProveedores.find((p) => p.id === data.proveedorId);

    if (editingOC) {
      setOrdenes((prev) =>
        prev.map((o) =>
          o.id === editingOC.id
            ? {
                ...o,
                proveedorId: data.proveedorId,
                proveedorNombre: proveedor?.nombre ?? '',
                descripcion: data.descripcion,
                monto: Number(data.monto),
                fechaEmision: data.fechaEmision,
                fechaEntrega: data.fechaEntrega,
                estado: data.estado,
                observaciones: data.observaciones || undefined,
              }
            : o,
        ),
      );
    } else {
      const newOC: OrdenCompra = {
        id: String(Date.now()),
        numero: `OC-2026-${String(nextOCNumber++).padStart(3, '0')}`,
        proveedorId: data.proveedorId,
        proveedorNombre: proveedor?.nombre ?? '',
        descripcion: data.descripcion,
        monto: Number(data.monto),
        fechaEmision: data.fechaEmision,
        fechaEntrega: data.fechaEntrega,
        estado: data.estado,
        observaciones: data.observaciones || undefined,
      };
      setOrdenes((prev) => [newOC, ...prev]);
    }
    setModalOpen(false);
  };

  const columns: Column<OrdenCompra>[] = [
    {
      key: 'numero',
      label: 'Numero',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.numero}</span>,
    },
    { key: 'proveedorNombre', label: 'Proveedor' },
    {
      key: 'descripcion',
      label: 'Descripcion',
      render: (row) => <span className={styles.descCell}>{row.descripcion}</span>,
    },
    {
      key: 'monto',
      label: 'Monto',
      getValue: (row) => row.monto,
      render: (row) => formatMonto(row.monto),
    },
    {
      key: 'fechaEmision',
      label: 'Emision',
      getValue: (row) => row.fechaEmision,
      render: (row) => formatFecha(row.fechaEmision),
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
          <h1 className={styles.pageTitle}>Ordenes de Compra</h1>
          <p className={styles.pageSubtitle}>
            {ordenesFiltradas.length} orden{ordenesFiltradas.length !== 1 ? 'es' : ''} encontrada{ordenesFiltradas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Nueva OC</button>
      </div>

      {/* Status filter */}
      <div className={styles.filters}>
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

      <DataTable
        columns={columns}
        data={ordenesFiltradas}
        keyField="id"
        searchPlaceholder="Buscar por numero, proveedor o descripcion..."
        defaultPageSize={10}
        pageSizes={[5, 10, 20]}
        emptyMessage="No se encontraron ordenes con los filtros seleccionados."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingOC ? `Editar ${editingOC.numero}` : 'Nueva Orden de Compra'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleSubmit(onSubmit)}>
              {editingOC ? 'Guardar Cambios' : 'Crear OC'}
            </button>
          </>
        }
      >
        <form className={modalStyles.formGrid} onSubmit={handleSubmit(onSubmit)}>
          <div className={modalStyles.formField}>
            <label htmlFor="proveedorId">Proveedor</label>
            <select
              id="proveedorId"
              {...register('proveedorId', { required: true })}
              style={errors.proveedorId ? { borderColor: 'var(--color-danger)' } : undefined}
            >
              <option value="">Seleccionar proveedor...</option>
              {mockProveedores.filter((p) => p.activo).map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div className={modalStyles.formField}>
            <label htmlFor="descripcion">Descripcion</label>
            <input
              id="descripcion"
              type="text"
              placeholder="Descripcion de la orden de compra"
              {...register('descripcion', { required: true })}
              style={errors.descripcion ? { borderColor: 'var(--color-danger)' } : undefined}
            />
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formField}>
              <label htmlFor="monto">Monto (ARS)</label>
              <input
                id="monto"
                type="number"
                placeholder="0"
                min="0"
                {...register('monto', { required: true, min: 1 })}
                style={errors.monto ? { borderColor: 'var(--color-danger)' } : undefined}
              />
            </div>
            <div className={modalStyles.formField}>
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                {...register('estado', { required: true })}
              >
                {Object.values(ESTADO_OC).map((estado) => (
                  <option key={estado} value={estado}>
                    {ESTADO_LABELS[estado]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formField}>
              <label htmlFor="fechaEmision">Fecha Emision</label>
              <input
                id="fechaEmision"
                type="date"
                {...register('fechaEmision', { required: true })}
                style={errors.fechaEmision ? { borderColor: 'var(--color-danger)' } : undefined}
              />
            </div>
            <div className={modalStyles.formField}>
              <label htmlFor="fechaEntrega">Fecha Entrega</label>
              <input
                id="fechaEntrega"
                type="date"
                {...register('fechaEntrega', { required: true })}
                style={errors.fechaEntrega ? { borderColor: 'var(--color-danger)' } : undefined}
              />
            </div>
          </div>

          <div className={modalStyles.formField}>
            <label htmlFor="observaciones">Observaciones <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(opcional)</span></label>
            <input
              id="observaciones"
              type="text"
              placeholder="Notas adicionales"
              {...register('observaciones')}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
