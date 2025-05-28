import { Platform } from 'react-native';

// Keys for storing data
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Type definitions
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type AuthData = {
  token: string;
  user: User;
};

// In-memory storage for native platforms
const memoryStorage: Record<string, string> = {};

// Simple storage implementation
const storage = {
  setItem: (key: string, value: string): void => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        memoryStorage[key] = value;
      }
    } catch (e) {
      console.error('Error saving data');
    }
  },
  getItem: (key: string): string | null => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      } else {
        return memoryStorage[key] || null;
      }
    } catch (e) {
      console.error('Error getting data');
      return null;
    }
  },
  removeItem: (key: string): void => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        delete memoryStorage[key];
      }
    } catch (e) {
      console.error('Error removing data');
    }
  }
};

/**
 * Save authentication data
 */
export async function saveAuthData(authData: AuthData): Promise<void> {
  storage.setItem(AUTH_TOKEN_KEY, authData.token);
  storage.setItem(USER_DATA_KEY, JSON.stringify(authData.user));
}

/**
 * Get authentication token
 */
export async function getAuthToken(): Promise<string | null> {
  return storage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Get user data
 */
export async function getUserData(): Promise<User | null> {
  const userData = storage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return !!token;
}

/**
 * Clear authentication data (logout)
 */
export async function clearAuthData(): Promise<void> {
  storage.removeItem(AUTH_TOKEN_KEY);
  storage.removeItem(USER_DATA_KEY);
} 