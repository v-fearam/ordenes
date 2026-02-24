import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type UserRole = 'admin' | 'proveedor';

export interface User {
  id: string;
  email: string;
  nombre: string;
  role: UserRole;
  proveedorId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const MOCK_USERS: Record<string, User> = {
  'farambarri@gmail.com': {
    id: '1',
    email: 'farambarri@gmail.com',
    nombre: 'Fernando Arambarri',
    role: 'admin',
  },
  'carlos@techsolutions.com': {
    id: '100',
    email: 'carlos@techsolutions.com',
    nombre: 'Carlos Mendez',
    role: 'proveedor',
    proveedorId: '1',
  },
};

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

  const login = useCallback(async (email: string, _password: string) => {
    const mockUser = MOCK_USERS[email.toLowerCase()];
    if (!mockUser) {
      throw new Error('Usuario no encontrado');
    }
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
