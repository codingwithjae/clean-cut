import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { AuthService } from '@/api/auth';
import type { LoginFormData, RegisterFormData } from '@/schemas/auth.schema';

interface User {
  id: number;
  email: string;
  name?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  handleGoogleCallback: (token: string, userData: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await AuthService.getMe();
        if (response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        }
      } catch (_error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = useCallback(async (data: LoginFormData) => {
    const response = await AuthService.login(data);
    localStorage.setItem('accessToken', response.accessToken);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    }
    setIsAuthenticated(true);
  }, []);

  const handleGoogleCallback = useCallback((token: string, userData: User) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const registerUser = useCallback(async (data: RegisterFormData) => {
    await AuthService.register(data);
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register: registerUser,
        logout,
        handleGoogleCallback,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
