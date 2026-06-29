import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../services/supabase.js";
import { getMeFn } from "../../lib/server-fns/auth.js";
import {
  type Role,
  type Permission,
  type User,
  type Session,
  normalizeRole,
  ROLE_PERMISSIONS,
} from "@quild/contracts";

export interface AuthState {
  session: Session | null;
  user: User | null;
  role: Role | null;
  permissions: Permission[];
  profile: any | null;
  loading: boolean;
  authenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const initialContextState: AuthState = {
  session: null,
  user: null,
  role: null,
  permissions: [],
  profile: null,
  loading: true,
  authenticated: false,
  accessToken: null,
  refreshToken: null,
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function updateAuthCookie(session: any) {
  if (typeof window === "undefined") return;

  if (session) {
    const rawToken = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.app_metadata?.role || "learner",
      },
    };
    const encoded = encodeURIComponent(JSON.stringify(rawToken));
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    document.cookie = `sb-auth-token=${encoded}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
  } else {
    document.cookie = `sb-auth-token=; path=/; max-age=0; SameSite=Lax; Secure`;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialContextState);

  const syncAuthState = async (session: any) => {
    updateAuthCookie(session);

    if (session) {
      // Query BFF loader to fetch profile and role from the API backend
      const me = await getMeFn();

      if (me) {
        setState({
          session: {
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            user: me.user,
          },
          user: me.user,
          role: me.user.role,
          permissions: me.user.permissions,
          profile: me.profile,
          loading: false,
          authenticated: true,
          accessToken: session.access_token,
          refreshToken: session.refresh_token || null,
        });
      } else {
        // Fallback: extract info directly from local JWT if API is not fully up
        const role = normalizeRole(session.user.app_metadata?.role);
        const permissions = ROLE_PERMISSIONS[role] || [];
        const fallbackUser: User = {
          id: session.user.id,
          email: session.user.email || "",
          role,
          permissions,
        };

        setState({
          session: {
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            user: fallbackUser,
          },
          user: fallbackUser,
          role,
          permissions,
          profile: null,
          loading: false,
          authenticated: true,
          accessToken: session.access_token,
          refreshToken: session.refresh_token || null,
        });
      }
    } else {
      setState({
        session: null,
        user: null,
        role: null,
        permissions: [],
        profile: null,
        loading: false,
        authenticated: false,
        accessToken: null,
        refreshToken: null,
      });
    }
  };

  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await syncAuthState(session);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncAuthState(session);
    }).catch(() => {
      setState(prev => ({ ...prev, loading: false }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const signUp = async (fullName: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const logout = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const { error } = await supabase.auth.signOut();
    if (error) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const refreshSession = async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    await syncAuthState(session);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signUp,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
