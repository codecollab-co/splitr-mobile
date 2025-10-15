import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '../services/ApiService';
import { userService, User, UserSyncData } from '../services/UserService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: UserSyncData) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get current user if token exists
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      // No valid token or user, stay signed out
      console.log('No authenticated user found');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Make auth request to backend
      const response = await apiService.post<{ user: User; token: string }>('/auth/sign-in', {
        email,
        password,
      });

      if (!response.success) {
        throw new Error(response.error || 'Sign in failed');
      }

      // Set token and user
      await apiService.setToken(response.data.token);
      setUser(response.data.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Sign in failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: UserSyncData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create new user account
      const response = await apiService.post<{ user: User; token: string }>('/auth/sign-up', userData);

      if (!response.success) {
        throw new Error(response.error || 'Sign up failed');
      }

      // Set token and user
      await apiService.setToken(response.data.token);
      setUser(response.data.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Sign up failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);

      // Clear token and user data
      await apiService.clearToken();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      setError(null);
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
    } catch (err: any) {
      console.error('Failed to refresh user:', err);
      setError('Failed to refresh user data');

      // If refresh fails, sign out user
      await signOut();
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
    error,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}