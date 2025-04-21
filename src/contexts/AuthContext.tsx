import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthContextType } from '@/interfaces/auth-context';
import api from '@/apis/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      const decoded: any = jwtDecode(token);
      const userId = decoded.sub;

      const response = await api.get(`/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.data);
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Có lỗi xảy ra khi lấy thông tin người dùng');
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        error,
        logout,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
