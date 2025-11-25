import { User as FirebaseUser } from 'firebase/auth';

// User data structure stored in Firestore
export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  photoURL?: string | null;
  createdAt: string;
  emailVerified: boolean;
}

// Sign up form data
export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Login form data
export interface LoginData {
  email: string;
  password: string;
}

// Password reset form data
export interface ResetPasswordData {
  email: string;
}

// Authentication context state
export interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: LoginData) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (otp: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

// Event types for the app
export type EventType = 'Assignment' | 'Entertainment' | 'Exam' | 'Special' | 'Sport' | 'Industry Visit';

// Event data structure
export interface Event {
  id: string;
  userId: string;
  type: EventType;
  title: string;
  date: string; 
  startTime: string;
  endTime: string;
  description: string;
  isFavorite: boolean;
  isCompleted: boolean;
  createdAt: string;
}
