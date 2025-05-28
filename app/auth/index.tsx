import { FontAwesome5 } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../utils/authContext';

// Ensure authentication redirect is handled properly
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { colors } = useTheme();
  const { login, loginWithGoogle, loginWithApple, register, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Handle Email/Password Sign In or Sign Up
  const handleEmailAuth = () => {
    if (isSignUp) {
      register(name, email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <FontAwesome5 name="rocket" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isSignUp 
              ? 'Sign up to get started with all our features' 
              : 'Log in to continue your journey'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: colors.surfaceVariant,
                    borderColor: colors.border,
                    color: colors.text
                  }
                ]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.border,
                  color: colors.text
                }
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Password</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.border,
                  color: colors.text
                }
              ]}
              placeholder="Enter your password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {!isSignUp && (
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: colors.primary },
              (!email || !password || (isSignUp && !name)) && styles.disabledButton
            ]}
            onPress={handleEmailAuth}
            disabled={!email || !password || (isSignUp && !name) || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isSignUp ? 'Sign Up' : 'Log In'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.separatorContainer}>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <Text style={[styles.separatorText, { color: colors.textSecondary }]}>
            OR CONTINUE WITH
          </Text>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.socialButton,
              { borderColor: colors.border, backgroundColor: colors.surfaceVariant }
            ]}
            onPress={loginWithGoogle}
            disabled={isLoading}
          >
            <FontAwesome5 name="google" size={20} color="#DB4437" />
            <Text style={[styles.socialButtonText, { color: colors.text }]}>
              Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialButton,
              { borderColor: colors.border, backgroundColor: colors.surfaceVariant }
            ]}
            onPress={loginWithApple}
            disabled={isLoading}
          >
            <FontAwesome5 name="apple" size={20} color={colors.text} />
            <Text style={[styles.socialButtonText, { color: colors.text }]}>
              Apple
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.switchContainer}>
          <Text style={[styles.switchText, { color: colors.textSecondary }]}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={[styles.switchActionText, { color: colors.primary }]}>
              {isSignUp ? 'Log In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  keyboardAvoidContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 500,
    alignSelf: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButton: {
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
  },
  separator: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    fontSize: 12,
    marginHorizontal: 10,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    width: '48%',
    borderWidth: 1,
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  switchText: {
    fontSize: 14,
  },
  switchActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
}); 