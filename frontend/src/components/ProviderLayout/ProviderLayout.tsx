import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SITE } from '../../constants/site';
import styles from './ProviderLayout.module.css';

export default function ProviderLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/portal/login');
  };

  return (
    <div className={styles.layout}>
      <header className={styles.topbar}>
        <div className={styles.logoSection}>
          <div className={styles.logoMark}>S</div>
          <div>
            <div className={styles.logoText}>Portal de Proveedores</div>
            <div className={styles.logoSubtext}>{SITE.company}</div>
          </div>
        </div>

        <div className={styles.userSection}>
          <span className={styles.userName}>{user?.nombre}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
