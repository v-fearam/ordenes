import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DataTable, { type Column } from '../../components/DataTable/DataTable';
import Modal, { modalStyles } from '../../components/Modal/Modal';
import { mockProveedores, mockUsuarios as initialUsuarios, type Usuario, type UserRole } from '../../mocks/data';
import styles from './UsuariosPage.module.css';

interface UsuarioForm {
  nombre: string;
  email: string;
  password: string;
  rol: UserRole;
  proveedorId: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<UsuarioForm>();
  const rolWatch = watch('rol');

  const openCreate = useCallback(() => {
    setEditingUser(null);
    reset({ nombre: '', email: '', password: '', rol: 'admin', proveedorId: '' });
    setModalOpen(true);
  }, [reset]);

  const openEdit = useCallback((user: Usuario) => {
    setEditingUser(user);
    reset({
      nombre: user.nombre,
      email: user.email,
      password: '',
      rol: user.rol,
      proveedorId: user.proveedorId ?? '',
    });
    setModalOpen(true);
  }, [reset]);

  const handleDelete = useCallback((id: string) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const onSubmit = (data: UsuarioForm) => {
    const proveedor = mockProveedores.find((p) => p.id === data.proveedorId);

    if (editingUser) {
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                nombre: data.nombre,
                email: data.email,
                rol: data.rol,
                proveedorId: data.rol === 'proveedor' ? data.proveedorId : undefined,
                proveedorNombre: data.rol === 'proveedor' ? proveedor?.nombre : undefined,
              }
            : u,
        ),
      );
    } else {
      const newUser: Usuario = {
        id: String(Date.now()),
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        proveedorId: data.rol === 'proveedor' ? data.proveedorId : undefined,
        proveedorNombre: data.rol === 'proveedor' ? proveedor?.nombre : undefined,
      };
      setUsuarios((prev) => [...prev, newUser]);
    }

    setModalOpen(false);
  };

  const columns: Column<Usuario>[] = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.nombre}</span>,
    },
    { key: 'email', label: 'Email' },
    {
      key: 'rol',
      label: 'Rol',
      getValue: (row) => row.rol,
      render: (row) => (
        <span className={`badge ${row.rol === 'admin' ? 'badge-info' : 'badge-success'}`}>
          {row.rol === 'admin' ? 'Admin' : 'Proveedor'}
        </span>
      ),
    },
    {
      key: 'proveedorNombre',
      label: 'Proveedor',
      render: (row) => row.proveedorNombre ?? '-',
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
          <h1 className={styles.pageTitle}>Usuarios</h1>
          <p className={styles.pageSubtitle}>{usuarios.length} usuarios registrados</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Nuevo Usuario</button>
      </div>

      <DataTable
        columns={columns}
        data={usuarios}
        keyField="id"
        searchPlaceholder="Buscar por nombre, email o proveedor..."
        defaultPageSize={10}
        pageSizes={[5, 10, 20]}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleSubmit(onSubmit)}>
              {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
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
              placeholder="Nombre completo"
              {...register('nombre', { required: true })}
              style={errors.nombre ? { borderColor: 'var(--color-danger)' } : undefined}
            />
          </div>

          <div className={modalStyles.formField}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="usuario@empresa.com"
              {...register('email', { required: true })}
              style={errors.email ? { borderColor: 'var(--color-danger)' } : undefined}
            />
          </div>

          <div className={modalStyles.formField}>
            <label htmlFor="password">
              Contrasena {editingUser && <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(dejar vacio para mantener)</span>}
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password', { required: !editingUser })}
              style={errors.password ? { borderColor: 'var(--color-danger)' } : undefined}
            />
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formField}>
              <label htmlFor="rol">Rol</label>
              <Controller
                name="rol"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <select id="rol" {...field}>
                    <option value="admin">Admin</option>
                    <option value="proveedor">Proveedor</option>
                  </select>
                )}
              />
            </div>

            {rolWatch === 'proveedor' && (
              <div className={modalStyles.formField}>
                <label htmlFor="proveedorId">Proveedor</label>
                <select
                  id="proveedorId"
                  {...register('proveedorId', { required: rolWatch === 'proveedor' })}
                  style={errors.proveedorId ? { borderColor: 'var(--color-danger)' } : undefined}
                >
                  <option value="">Seleccionar...</option>
                  {mockProveedores.filter((p) => p.activo).map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}
