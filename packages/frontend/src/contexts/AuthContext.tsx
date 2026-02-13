import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import type { Admin } from "@visitas-angelim/shared";

interface AuthState {
  user: User | null;
  admin: Admin | null;
  loading: boolean;
  error: Error | null;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    admin: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const adminDoc = await getDoc(doc(db, "admins", user.uid));
          if (adminDoc.exists()) {
            const data = adminDoc.data();
            setState({
              user,
              admin: {
                uid: user.uid,
                email: data.email as string,
                name: data.name as string,
                createdAt: data.createdAt,
              },
              loading: false,
              error: null,
            });
          } else {
            // User exists in Auth but not in admins collection
            await firebaseSignOut(auth);
            setState({
              user: null,
              admin: null,
              loading: false,
              error: new Error("Usuário não autorizado"),
            });
          }
        } catch (err) {
          setState({
            user: null,
            admin: null,
            loading: false,
            error: err as Error,
          });
        }
      } else {
        setState({ user: null, admin: null, loading: false, error: null });
      }
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the rest
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err as Error }));
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
