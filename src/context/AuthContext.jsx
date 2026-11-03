import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageUtils } from '../utils/storageUtils';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = storageUtils.getAuthUser();
    return stored || {
      id: "usr-demo-01",
      name: "Startup Founder",
      email: "demo@novatech.com",
      role: "Startup Founder & Marketing Lead",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    };
  });
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Check initial Supabase Auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const authUser = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          email: session.user.email,
          role: "Startup Founder",
          avatar: session.user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        };
        setUser(authUser);
        storageUtils.saveAuthUser(authUser);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const authUser = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          email: session.user.email,
          role: "Startup Founder",
          avatar: session.user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        };
        setUser(authUser);
        storageUtils.saveAuthUser(authUser);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        storageUtils.saveAuthUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      storageUtils.saveAuthUser(updated);
      return updated;
    });
  };

  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const loggedUser = {
        id: data.user.id,
        name: data.user.user_metadata?.full_name || email.split('@')[0],
        email: data.user.email,
        role: "Marketing Manager",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      };
      setUser(loggedUser);
      storageUtils.saveAuthUser(loggedUser);
      return loggedUser;
    }

    const newUser = {
      id: "usr-" + Date.now(),
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role: "Marketing Manager",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    };
    setUser(newUser);
    storageUtils.saveAuthUser(newUser);
    return newUser;
  };

  const register = async (name, email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) throw error;
      const registeredUser = {
        id: data.user.id,
        name,
        email: data.user.email,
        role: "Startup Owner",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      };
      setUser(registeredUser);
      storageUtils.saveAuthUser(registeredUser);
      return registeredUser;
    }

    const newUser = {
      id: "usr-" + Date.now(),
      name,
      email,
      role: "Startup Owner",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    };
    setUser(newUser);
    storageUtils.saveAuthUser(newUser);
    return newUser;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    storageUtils.saveAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAuthenticated: !!user, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

