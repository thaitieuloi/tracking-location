import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";

interface FamilyMember {
  user_id: string;
  role: string;
  profile: {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    created_at: string;
    updated_at: string;
  };
  location: {
    user_id: string;
    latitude: number;
    longitude: number;
    accuracy: number | null;
    speed: number | null;
    heading: number | null;
    is_moving: boolean | null;
    battery_level: number | null;
    updated_at: string;
  } | null;
}

interface FamilyData {
  family: {
    id: string;
    name: string;
    invite_code: string;
    created_by: string;
    created_at: string;
    updated_at: string;
  };
  members: FamilyMember[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  family: FamilyData | null;
  familyLoading: boolean;
  refreshFamily: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
  family: null,
  familyLoading: false,
  refreshFamily: async () => {},
});

const BASE_URL = import.meta.env.BASE_URL || "/";
const API_BASE = BASE_URL.endsWith("/") ? `${BASE_URL}api` : `${BASE_URL}/api`;

async function apiFetch(path: string, userId: string, token: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "x-user-id": userId,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [family, setFamily] = useState<FamilyData | null>(null);
  const [familyLoading, setFamilyLoading] = useState(false);
  const [, setLocation] = useLocation();

  const fetchFamily = useCallback(async (currentUser: User, currentSession: Session) => {
    setFamilyLoading(true);
    try {
      await apiFetch("/auth/profile", currentUser.id, currentSession.access_token);
      const familyData = await apiFetch("/families/my", currentUser.id, currentSession.access_token);
      setFamily(familyData);
    } catch {
      setFamily(null);
    } finally {
      setFamilyLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (session?.user) {
        fetchFamily(session.user, session);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchFamily(session.user, session);
      } else {
        setFamily(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchFamily]);

  const refreshFamily = useCallback(async () => {
    if (user && session) {
      await fetchFamily(user, session);
    }
  }, [user, session, fetchFamily]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setFamily(null);
    setLocation("/auth");
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      isAuthenticated: !!user,
      logout,
      family,
      familyLoading,
      refreshFamily,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
