import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, User } from "./supabase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: any; data: any }>;
  signUp: (
    email: string,
    password: string,
    role: "admin" | "customer",
  ) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any; data: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        try {
          // Get user data from our users table
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!error && data) {
            setUser(data as User);
          } else if (error) {
            // If user doesn't exist in our users table yet, create it
            const { error: insertError } = await supabase.from("users").insert([
              {
                id: session.user.id,
                email: session.user.email,
                role: "customer",
                is_suspended: false,
              },
            ]);

            if (!insertError) {
              // Fetch the user again after creating
              const { data: newUser } = await supabase
                .from("users")
                .select("*")
                .eq("id", session.user.id)
                .single();

              if (newUser) {
                setUser(newUser as User);
              }
            }
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }

      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          // Get user data from our users table
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!error && data) {
            setUser(data as User);
          } else {
            // If user doesn't exist in our users table yet, create it
            const { error: insertError } = await supabase.from("users").insert([
              {
                id: session.user.id,
                email: session.user.email,
                role: "customer",
                is_suspended: false,
              },
            ]);

            if (!insertError) {
              // Fetch the user again after creating
              const { data: newUser } = await supabase
                .from("users")
                .select("*")
                .eq("id", session.user.id)
                .single();

              if (newUser) {
                setUser(newUser as User);
              }
            }
          }
        } catch (err) {
          console.error("Error in auth state change:", err);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    role: "admin" | "customer" = "customer",
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error && data.user) {
      // Create a new user in our users table
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email,
          role,
          is_suspended: false,
        },
      ]);

      if (insertError) {
        return { error: insertError, data: null };
      }
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      // Check if user is suspended
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (!userError && userData && userData.is_suspended) {
        // Sign out if user is suspended
        await supabase.auth.signOut();
        return {
          error: {
            message: "Your account has been suspended. Please contact support.",
          },
          data: null,
        };
      }

      setUser(userData as User);
    }

    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
