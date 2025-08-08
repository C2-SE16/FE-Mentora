import { useState, useEffect } from 'react';

interface User {
  userId: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Lấy token từ localStorage khi component mount
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (userData: User, authToken: string) => {
    localStorage.setItem('accessToken', authToken);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
  };

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };
}
