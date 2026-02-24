import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../admin/LoginPage.module.css';

interface LoginForm {
  email: string;
  password: string;
}

export default function PortalLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.email, data.password, 'proveedor');
      navigate('/portal');
    } catch {
      setError('Credenciales invalidas');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoMark}>S</div>
          <h1 className={styles.title}>Portal de Proveedores</h1>
          <p className={styles.subtitle}>Ingresa tus credenciales para continuar</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="proveedor@empresa.com"
              {...register('email', { required: true })}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Contrasena</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password', { required: true })}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ingresando...' : 'Iniciar Sesion'}
          </button>
        </form>
      </div>
    </div>
  );
}
