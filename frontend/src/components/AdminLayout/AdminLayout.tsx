import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_NAV, SITE } from '../../constants/site';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={styles.layout}>
      <header className={styles.topbar}>
        <div className={styles.logoSection}>
          <img src="/logo-snoop.jpg" alt="Snoop Consulting" className={styles.logoImg} />
          <div>
            <div className={styles.logoText}>{SITE.name}</div>
            <div className={styles.logoSubtext}>{SITE.company}</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

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
