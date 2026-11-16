import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('daily-diet-user') ?? 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('daily-diet-token')));

  useEffect(() => {
    const clearSession = () => {
      setUser(null);
      setLoading(false);
    };
    window.addEventListener('daily-diet:unauthorized', clearSession);
    if (localStorage.getItem('daily-diet-token')) {
      api('/auth/me')
        .then(({ user: currentUser }) => {
          setUser(currentUser);
          localStorage.setItem('daily-diet-user', JSON.stringify(currentUser));
        })
        .catch(clearSession)
        .finally(() => setLoading(false));
    }
    return () => window.removeEventListener('daily-diet:unauthorized', clearSession);
  }, []);

  async function signIn(endpoint, values) {
    const result = await api(`/auth/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(values),
    });
    localStorage.setItem('daily-diet-token', result.token);
    localStorage.setItem('daily-diet-user', JSON.stringify(result.user));
    setUser(result.user);
  }

  function signOut() {
    localStorage.removeItem('daily-diet-token');
    localStorage.removeItem('daily-diet-user');
    setUser(null);
  }

  const value = useMemo(() => ({
    user, loading,
    login: (values) => signIn('login', values),
    register: (values) => signIn('register', values),
    logout: signOut,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
