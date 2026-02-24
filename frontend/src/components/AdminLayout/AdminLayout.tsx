import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX, FiLogOut, FiUser, FiHome, FiSettings, FiUsers, FiBox, FiTruck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_NAV, SITE } from '../../constants/site';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getIcon = (label: string) => {
    switch (label) {
      case 'Dashboard': return <FiHome />;
      case 'Ordenes de Compra': return <FiBox />;
      case 'Proveedores': return <FiTruck />;
      case 'Usuarios': return <FiUsers />;
      default: return <FiSettings />;
    }
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className={styles.layout}>
      <header className={styles.topbar}>
        <div className={styles.topbarContent}>
          <div className={styles.leftSection}>
            <button
              className={styles.menuToggle}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <div className={styles.logoSection}>
              <img src="/logo-snoop.jpg" alt="Snoop Consulting" className={styles.logoImg} />
              <div className={styles.logoTextWrapper}>
                <div className={styles.logoText}>{SITE.name}</div>
                <div className={styles.logoSubtext}>{SITE.company}</div>
              </div>
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
                <span className={styles.navIcon}>{getIcon(item.label)}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <FiUser className={styles.userIcon} />
              <span className={styles.userName}>{user?.nombre}</span>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
              <FiLogOut size={16} />
              <span className={styles.logoutText}>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`${styles.drawerOverlay} ${isMobileMenuOpen ? styles.drawerOpen : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Drawer */}
      <aside className={`${styles.drawer} ${isMobileMenuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <div className={styles.logoSection}>
            <img src="/logo-snoop.jpg" alt="Snoop Consulting" className={styles.logoImg} />
            <div className={styles.logoTextWrapper}>
              <div className={styles.logoText}>{SITE.name}</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={closeMenu}>
            <FiX size={20} />
          </button>
        </div>
        <nav className={styles.drawerNav}>
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ''}`
              }
            >
              <span className={styles.navIcon}>{getIcon(item.label)}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.drawerFooter}>
          <div className={styles.userInfoMobile}>
            <FiUser size={20} />
            <span className={styles.userName}>{user?.nombre}</span>
          </div>
          <button className={styles.logoutBtnMobile} onClick={handleLogout}>
            <FiLogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
