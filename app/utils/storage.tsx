import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

// Dummy component to satisfy Expo Router (which expects all files to export a React component)
export default function StorageUtilsPage() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Storage Utilities</Text>
      <Text style={{ marginBottom: 20, textAlign: 'center' }}>
        This file contains utility functions for storage operations. 
        It is not meant to be accessed directly as a page.
      </Text>
      <Link href="/" style={{ padding: 10, backgroundColor: '#0066cc', borderRadius: 5 }}>
        <Text style={{ color: 'white' }}>Go back to home</Text>
      </Link>
    </View>
  );
}

// Note: The actual storage utilities have been moved to src/lib/storage.ts 