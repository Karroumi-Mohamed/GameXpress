import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import api from '../lib/axios';

interface AuthContextType {
  user: any | null;
  setUser: (user: any | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user');
        setUser(response.data);
      } catch (error) {
        console.log('No authenticated user found on load or error fetching user:', error);
        setUser(null);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchUser();
  }, []); 

  const logout = useCallback(async () => {
    setIsLoading(true); 
    try {
      await api.post('/logout');
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
    } finally {
       setIsLoading(false);
    }
  }, []);


  if (isLoading) {
     return <div>Loading authentication status...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
