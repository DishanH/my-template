import { Stack } from 'expo-router';
import React from 'react';
import { ThemeProvider } from '../../context/ThemeContext';

export default function OnboardingLayout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' }
        }}
      />
    </ThemeProvider>
  );
} 