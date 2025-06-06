import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const SignInScreen = () => {
  const { colors, fontSize, isDarkMode } = useSettings();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { signIn, socialSignIn, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    const success = await signIn(email, password);
    
    if (!success) {
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    }
    // Navigation will be handled automatically by the auth state change
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    const success = await socialSignIn(provider);
    
    if (!success) {
      Alert.alert('Error', `Failed to sign in with ${provider}. Please try again.`);
    }
    // Navigation will be handled automatically by the auth state change
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary, fontSize: fontSize.large * 1.5 }]}>
              Welcome to SimpleText
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: fontSize.normal }]}>
              Sign in to improve your writing
            </Text>
          </View>

          <View style={styles.form}>
            <View style={[
              styles.inputContainer,
              { backgroundColor: isDarkMode ? colors.bubbleReceived : '#f5f5f5' }
            ]}>
              <Ionicons name="mail-outline" size={22} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  { color: colors.textPrimary, fontSize: fontSize.normal }
                ]}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={[
              styles.inputContainer,
              { backgroundColor: isDarkMode ? colors.bubbleReceived : '#f5f5f5' }
            ]}>
              <Ionicons name="lock-closed-outline" size={22} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[
                  styles.input,
                  { color: colors.textPrimary, fontSize: fontSize.normal }
                ]}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.visibilityToggle}>
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.accent }
              ]}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.buttonText, { fontSize: fontSize.normal }]}>Sign In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: colors.accent, fontSize: fontSize.small }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.textSecondary }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary, fontSize: fontSize.small }]}>
                OR
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.textSecondary }]} />
            </View>

            <TouchableOpacity
              style={[
                styles.socialButton,
                { backgroundColor: isDarkMode ? '#34383F' : '#fff' }
              ]}
              onPress={() => handleSocialSignIn('google')}
              disabled={isLoading}
            >
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text
                style={[
                  styles.socialButtonText,
                  { color: colors.textPrimary, fontSize: fontSize.normal }
                ]}
              >
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialButton,
                { backgroundColor: isDarkMode ? '#34383F' : '#fff' }
              ]}
              onPress={() => handleSocialSignIn('apple')}
              disabled={isLoading}
            >
              <Ionicons name="logo-apple" size={22} color={isDarkMode ? '#fff' : '#000'} />
              <Text
                style={[
                  styles.socialButtonText,
                  { color: colors.textPrimary, fontSize: fontSize.normal }
                ]}
              >
                Continue with Apple
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary, fontSize: fontSize.small }]}>
              Do not have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.footerLink, { color: colors.accent, fontSize: fontSize.small }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 36,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
  },
  visibilityToggle: {
    padding: 8,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
  dividerText: {
    marginHorizontal: 16,
    textTransform: 'uppercase',
    opacity: 0.5,
  },
  socialButton: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  socialButtonText: {
    fontWeight: '500',
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    marginRight: 4,
  },
  footerLink: {
    fontWeight: '600',
  },
});

export default SignInScreen; 