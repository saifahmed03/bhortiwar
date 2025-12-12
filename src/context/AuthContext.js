// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { signOut as authSignOut } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Check for mock session first
    const checkAuth = () => {
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        try {
          const session = JSON.parse(mockSession);
          setUser(session.user || null);
          setLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing mock session:', e);
        }
      }

      // Otherwise use Supabase
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user || null);
        setLoading(false);
      });
    };

    checkAuth();

    // Listen for storage changes (for mock auth)
    const handleStorageChange = (e) => {
      if (e.key === 'mockSession') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      // Also update localStorage for mock auth
      if (session?.user) {
        localStorage.setItem('mockSession', JSON.stringify({ user: session.user, access_token: 'mock-token' }));
      }
    });

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = async () => {
    try {
      await authSignOut();
      setUser(null);
      setProfile(null);
      // Clear localStorage
      localStorage.removeItem('mockSession');
      localStorage.removeItem('mockUser');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, profile, setProfile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

