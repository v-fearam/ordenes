import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
  requiredRole: UserRole;
  loginPath: string;
}

export default function ProtectedRoute({ children, requiredRole, loginPath }: Props) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== requiredRole) {
    return <Navigate to={loginPath} replace />;
  }

  return <>{children}</>;
}
