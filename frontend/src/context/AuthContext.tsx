import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type UserRole = 'admin' | 'proveedor';

interface User {
  id: string;
  email: string;
  nombre: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'snoop_auth';

function getStoredAuth(): { user: User; token: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = getStoredAuth();
  const [user, setUser] = useState<User | null>(stored?.user ?? null);
  const [token, setToken] = useState<string | null>(stored?.token ?? null);

  const login = useCallback(async (_email: string, _password: string, role: UserRole) => {
    // MOCK: In prototype, accept any credentials
    const mockUser: User = {
      id: role === 'admin' ? '1' : '100',
      email: _email,
      nombre: role === 'admin' ? 'Admin Compras' : 'Proveedor Demo',
      role,
    };
    const mockToken = 'mock-jwt-token-' + Date.now();

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: mockUser, token: mockToken }));
    setUser(mockUser);
    setToken(mockToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
