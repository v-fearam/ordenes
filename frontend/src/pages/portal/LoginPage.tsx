import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../admin/LoginPage.module.css';

interface LoginForm {
  email: string;
  password: string;
}

export default function PortalLoginPage() {
  const { login, logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginForm>();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'proveedor') {
      navigate('/portal');
    } else if (isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, user, navigate, logout]);

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/portal');
    } catch {
      setError('Credenciales invalidas. Usa carlos@techsolutions.com / 123');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <img src="/logo-snoop.jpg" alt="Snoop Consulting" className={styles.logoImg} />
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
              placeholder="carlos@techsolutions.com"
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

        <p className={styles.portalLink}>
          <a href="/admin/login">Acceder como administrador</a>
        </p>
      </div>
    </div>
  );
}
