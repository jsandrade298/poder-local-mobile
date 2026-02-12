import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

/* ────────────────────────── types ────────────────────────── */

interface TenantInfo {
  id: string;
  nome: string;
  slug: string;
  plano: string;
  ativo: boolean;
}

interface ProfileInfo {
  id: string;
  nome: string;
  email: string;
  tenant_id: string | null;
  role_no_tenant: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profileLoading: boolean;
  profile: ProfileInfo | null;
  tenant: TenantInfo | null;
  tenantId: string | null;
  roleNoTenant: string | null;
  isTenantAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ────────────────────────── provider ────────────────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [tenant, setTenant] = useState<TenantInfo | null>(null);

  /* ── carregar profile + tenant ── */
  const loadProfileAndTenant = useCallback(async (userId: string) => {
    setProfileLoading(true);
    try {
      // Buscar profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, nome, email, tenant_id, role_no_tenant")
        .eq("id", userId)
        .single();

      if (profileError || !profileData) {
        console.warn("Erro ao carregar profile:", profileError?.message);
        setProfile(null);
        setTenant(null);
        setProfileLoading(false);
        return;
      }

      setProfile(profileData);

      // Buscar tenant se existir
      if (profileData.tenant_id) {
        const { data: tenantData } = await supabase
          .from("tenants")
          .select("id, nome, slug, plano, ativo")
          .eq("id", profileData.tenant_id)
          .single();

        if (tenantData) {
          setTenant(tenantData);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar profile/tenant:", error);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  /* ── listener de sessão ── */
  useEffect(() => {
    // Recuperar sessão existente
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        loadProfileAndTenant(currentSession.user.id);
      } else {
        setProfileLoading(false);
      }
      setLoading(false);
    });

    // Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          loadProfileAndTenant(newSession.user.id);
        } else {
          setProfile(null);
          setTenant(null);
          setProfileLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfileAndTenant]);

  /* ── sign in ── */
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    return { error };
  }, []);

  /* ── sign out ── */
  const signOut = useCallback(async () => {
    setProfile(null);
    setTenant(null);
    await supabase.auth.signOut();
  }, []);

  /* ── refresh ── */
  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfileAndTenant(user.id);
    }
  }, [user, loadProfileAndTenant]);

  /* ── context value ── */
  const value: AuthContextType = {
    user,
    session,
    loading,
    profileLoading,
    profile,
    tenant,
    tenantId: profile?.tenant_id ?? null,
    roleNoTenant: profile?.role_no_tenant ?? null,
    isTenantAdmin: profile?.role_no_tenant === "admin",
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ────────────────────────── hook ────────────────────────── */

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return context;
}
