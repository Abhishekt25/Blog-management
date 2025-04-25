import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

interface AuthContextType {
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:2507";

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendURL}/api/check-auth`, {
        withCredentials: true,
      });
      
      if (response.data.isAuthenticated) {
        setAuthState({
          isAuthenticated: true,
          user: response.data.user,
          token: null, // Token is in httpOnly cookie
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendURL}/api/signin`,
        { email, password },
        { withCredentials: true }
      );

      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${backendURL}/api/logout`, {}, { withCredentials: true });
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
      });
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        login,
        logout,
        checkAuth,
        loading,
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