import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the shape of the authentication context
type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  loginWithGoogle: async () => {},
  loginWithApple: async () => {},
  register: async () => {},
  logout: () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user is authenticated on mount
  useEffect(() => {
    // In a real app, you would check if the user is authenticated
    // For this demo, we'll just set it to false
    setIsAuthenticated(false);
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would authenticate with your backend
      // For this demo, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsAuthenticated(true);
      
      // Navigate to the home screen
      router.replace('/');
    } catch (error) {
      console.error('Login Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would authenticate with Google
      // For this demo, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsAuthenticated(true);
      
      // Navigate to the home screen
      router.replace('/');
    } catch (error) {
      console.error('Google Login Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Apple
  const loginWithApple = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would authenticate with Apple
      // For this demo, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsAuthenticated(true);
      
      // Navigate to the home screen
      router.replace('/');
    } catch (error) {
      console.error('Apple Login Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register a new user
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would register the user with your backend
      // For this demo, we'll just simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsAuthenticated(true);
      
      // Navigate to the home screen
      router.replace('/');
    } catch (error) {
      console.error('Registration Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setIsAuthenticated(false);
    
    // Navigate to the login screen
    router.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        loginWithGoogle,
        loginWithApple,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 