import StorageHelper from '@/services/storageHelper';
import React, { createContext, useContext, useEffect, useState } from 'react';

// User type
export type User = {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
};

// Auth context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  socialSignIn: (provider: 'google' | 'apple') => Promise<boolean>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
type AuthProviderProps = {
  children: React.ReactNode;
};

// Storage key
const USER_STORAGE_KEY = 'simpletext_user';

// Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await StorageHelper.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user to storage whenever it changes
  useEffect(() => {
    const saveUser = async () => {
      try {
        if (user) {
          await StorageHelper.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
          await StorageHelper.removeItem(USER_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to save user to storage:', error);
      }
    };

    saveUser();
  }, [user]);

  // Sign in
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call - in a real app, you would validate with a backend
      // This is a dummy authentication that always succeeds
      const dummyUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        isAuthenticated: true
      };
      
      setUser(dummyUser);
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up
  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      const dummyUser: User = {
        id: Date.now().toString(),
        email,
        name,
        isAuthenticated: true
      };
      
      setUser(dummyUser);
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Social sign in
  const socialSignIn = async (provider: 'google' | 'apple'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      const dummyUser: User = {
        id: Date.now().toString(),
        email: `user_${Date.now()}@example.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        isAuthenticated: true
      };
      
      setUser(dummyUser);
      return true;
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Clear user data
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    socialSignIn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 