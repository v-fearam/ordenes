import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout/AdminLayout';
import ProviderLayout from './components/ProviderLayout/ProviderLayout';
import AdminLoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import OrdenesPage from './pages/admin/OrdenesPage';
import ProveedoresPage from './pages/admin/ProveedoresPage';
import PortalLoginPage from './pages/portal/LoginPage';
import MisOrdenesPage from './pages/portal/MisOrdenesPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* Admin Portal */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin" loginPath="/admin/login">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="ordenes" element={<OrdenesPage />} />
            <Route path="proveedores" element={<ProveedoresPage />} />
          </Route>

          {/* Provider Portal */}
          <Route path="/portal/login" element={<PortalLoginPage />} />
          <Route
            path="/portal"
            element={
              <ProtectedRoute requiredRole="proveedor" loginPath="/portal/login">
                <ProviderLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MisOrdenesPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
