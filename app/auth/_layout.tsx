import { Stack } from 'expo-router';
import React from 'react';
import { ThemeProvider } from '../theme/ThemeContext';

export default function AuthLayout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' },
          animation: 'slide_from_right',
        }}
      />
    </ThemeProvider>
  );
} 