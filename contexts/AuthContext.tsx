import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User, SignUpData, LoginData, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  //Sign up with email and password
  
  const signUp = async (data: SignUpData): Promise<void> => {
    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: `${data.firstName} ${data.lastName}`,
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Create user document in Firestore
      const userData: User = {
        uid: userCredential.user.uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        photoURL: userCredential.user.photoURL || null,
        createdAt: new Date().toISOString(),
        emailVerified: false,
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.message || 'Sign up failed');
    }
  };

  // Sign in with email and password
  const signIn = async (data: LoginData): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<void> => {
    try {
      //Implement Google Sign-In
      // This requires Google Sign-In configuration in Firebase Console
      throw new Error('Google Sign-In will be implemented');
    } catch (error: any) {
      throw new Error(error.message || 'Google sign-in failed');
    }
  };

  // Sign out current user
  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error: any) {
      throw new Error(error.message || 'Sign out failed');
    }
  };

  // Send password reset email
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  };

  // Verify email with OTP
  const verifyEmail = async (otp: string): Promise<void> => {
    try {
      // Firebase uses email link verification by default
      throw new Error('Email verification handled by Firebase email link');
    } catch (error: any) {
      throw new Error(error.message || 'Email verification failed');
    }
  };

  // Update user profile data
  const updateUserProfile = async (data: Partial<User>): Promise<void> => {
    try {
      if (!firebaseUser) throw new Error('No user logged in');

      // Update Firestore document
      await updateDoc(doc(db, 'users', firebaseUser.uid), data);

      // Update local state
      setUser((prev) => (prev ? { ...prev, ...data } : null));
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    verifyEmail,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
