import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionResolved, setSessionResolved] = useState(!isSupabaseConfigured);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession()
      .then(({ data }) => setSession(data.session))
      .finally(() => setSessionResolved(true));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionResolved(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!sessionResolved) return;
    if (!supabase || !session?.user) {
      setIsAdmin(false);
      if (supabase) setLoading(false);
      return;
    }
    setLoading(true);
    supabase.from("admin_users").select("user_id").eq("user_id", session.user.id).maybeSingle()
      .then(({ data, error }) => {
        setIsAdmin(Boolean(data) && !error);
        setLoading(false);
      })
      .catch(() => { setIsAdmin(false); setLoading(false); });
  }, [session, sessionResolved]);

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    isAdmin,
    loading,
    configured: isSupabaseConfigured,
    signIn: async (email, password) => {
      if (!supabase) throw new Error("Supabase is not configured.");
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    signOut: async () => {
      if (supabase) await supabase.auth.signOut();
    },
  }), [isAdmin, loading, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
