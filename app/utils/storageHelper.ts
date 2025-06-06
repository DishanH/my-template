import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Storage keys
const CONVERSATION_IDS_KEY = 'simpletext_conversation_ids';
const getConversationKey = (id: string) => `simpletext_conversation_${id}`;

// For web platform
const webStorage = {
  getItem: (key: string): string | null => {
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    localStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
  getAllKeys: (): string[] => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.push(key);
    }
    return keys;
  }
};

/**
 * Storage helper for cross-platform compatibility
 * This handles both Expo SecureStore and web localStorage
 */
const StorageHelper = {
  /**
   * Get item from storage
   */
  getItem: async (key: string): Promise<string | null> => {
    try {
      // Web environment
      if (Platform.OS === 'web') {
        const value = webStorage.getItem(key);
        return Promise.resolve(value);
      }
      // React Native environment with SecureStore
      const value = await SecureStore.getItemAsync(key);
      return value;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },

  /**
   * Set item in storage
   */
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      // Web environment
      if (Platform.OS === 'web') {
        webStorage.setItem(key, value);
        return Promise.resolve();
      }
      // React Native environment with SecureStore
      await SecureStore.setItemAsync(key, value);
      
      // Record the key for tracking
      await StorageHelper.recordKey(key);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  },

  /**
   * Remove item from storage
   */
  removeItem: async (key: string): Promise<void> => {
    try {
      // Web environment
      if (Platform.OS === 'web') {
        webStorage.removeItem(key);
        return Promise.resolve();
      }
      // React Native environment with SecureStore
      await SecureStore.deleteItemAsync(key);
      return Promise.resolve();
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  },

  /**
   * Clear all items with a certain prefix
   */
  clearItemsWithPrefix: async (prefix: string): Promise<void> => {
    try {
      // Web environment
      if (Platform.OS === 'web') {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            keysToRemove.push(key);
          }
        }
        // Remove all matching keys
        keysToRemove.forEach(key => webStorage.removeItem(key));
        return Promise.resolve();
      } 
      
      // React Native environment with SecureStore
      // Note: SecureStore doesn't have a direct method to get all keys
      // We need an alternative approach
      // For now, we'll need to maintain a separate record of keys
      // This is a limitation of SecureStore compared to MMKV
      const allKeysJson = await SecureStore.getItemAsync('all_secure_store_keys');
      if (allKeysJson) {
        const allKeys = JSON.parse(allKeysJson) as string[];
        const keysToRemove = allKeys.filter(key => key.startsWith(prefix));
        
        // Delete each key
        for (const key of keysToRemove) {
          await SecureStore.deleteItemAsync(key);
        }
        
        // Update the record of keys
        const updatedKeys = allKeys.filter(key => !key.startsWith(prefix));
        await SecureStore.setItemAsync('all_secure_store_keys', JSON.stringify(updatedKeys));
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error clearing items with prefix:', error);
    }
  },
  
  /**
   * Helper to record a new key in the keys registry
   * This is needed for SecureStore to keep track of all keys
   */
  recordKey: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') return;
    
    try {
      const allKeysJson = await SecureStore.getItemAsync('all_secure_store_keys');
      const allKeys = allKeysJson ? JSON.parse(allKeysJson) as string[] : [];
      
      if (!allKeys.includes(key)) {
        allKeys.push(key);
        await SecureStore.setItemAsync('all_secure_store_keys', JSON.stringify(allKeys));
      }
    } catch (error) {
      console.error('Error recording key:', error);
    }
  },

  // Helper methods specific to SimpleText
  getConversationIdsKey: () => CONVERSATION_IDS_KEY,
  getConversationKey: (id: string) => getConversationKey(id)
};

export default StorageHelper; 