import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../../utils/supabase';
import type { AuthUser, UserRole } from '../../../types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  role: UserRole;
  isAdmin: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserWithRole = async (sessionUser: User | null) => {
    if (!sessionUser) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', sessionUser.id)
        .maybeSingle();

      const rawRole = (
        profile?.role ||
        sessionUser.user_metadata?.role ||
        sessionUser.app_metadata?.role
      )
        ?.toString()
        .toLowerCase();

      const role: UserRole = rawRole === 'admin' ? 'admin' : 'cashier';

      const authUser: AuthUser = {
        ...sessionUser,
        role,
        fullName:
          profile?.full_name ?? sessionUser.user_metadata?.full_name ?? null,
      };

      setUser(authUser);
      return authUser;
    } catch (err) {
      console.error('[AuthProvider] Error loading user profile:', err);
      const fallbackUser: AuthUser = {
        ...sessionUser,
        role: 'admin',
        fullName: null,
      };
      setUser(fallbackUser);
      return fallbackUser;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      loadUserWithRole(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      loadUserWithRole(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const role: UserRole = user?.role ?? 'cashier';
  const isAdmin = role === 'admin';

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: error.message };
    }

    if (data.session) {
      setSession(data.session);
    }

    if (data.user) {
      await loadUserWithRole(data.user);
    }

    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, role, isAdmin, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
