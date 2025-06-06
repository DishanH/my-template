import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const SettingsScreen = () => {
  const { colors, fontSize, theme, setTheme, fontSizeLevel, setFontSizeLevel } = useSettings();
  const { user, signOut } = useAuth();
  const isDarkMode = theme === 'dark';
  const navigation = useNavigation();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // Remove custom header setting and keep only animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  // Play haptic feedback
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } 
      catch (error) { console.log('Haptic feedback unavailable'); }
    }
  };

  // Set theme with haptic feedback
  const handleSetTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    triggerHaptic();
  };
  
  // Set font size with haptic feedback
  const handleSetFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSizeLevel(size);
    triggerHaptic();
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            triggerHaptic();
            await signOut();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['left', 'right', 'bottom']}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
          {/* Theme Section */}
          <View style={[
            styles.card,
            { 
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
              shadowColor: isDarkMode ? '#000' : '#888',
              marginTop: 16,
            }
          ]}>
            <View style={styles.cardHeader}>
              <Ionicons 
                name="color-palette-outline" 
                size={22} 
                color={colors.accent} 
                style={styles.cardIcon}
              />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Theme
              </Text>
            </View>
            
            <View style={styles.themeButtons}>
              {(['light', 'dark', 'system'] as const).map((themeOption) => (
                <TouchableOpacity
                  key={themeOption}
                  style={[
                    styles.themeButton,
                    { 
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
                      borderColor: theme === themeOption ? colors.accent : 'transparent',
                      borderWidth: 2,
                    }
                  ]}
                  onPress={() => handleSetTheme(themeOption)}
                >
                  <View style={[
                    styles.themeIconContainer,
                    { 
                      backgroundColor: theme === themeOption 
                        ? colors.accent 
                        : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
                    }
                  ]}>
                    <Ionicons 
                      name={
                        themeOption === 'light' ? 'sunny-outline' :
                        themeOption === 'dark' ? 'moon-outline' : 
                        'phone-portrait-outline'
                      } 
                      size={20} 
                      color={theme === themeOption ? '#fff' : colors.textSecondary} 
                    />
                  </View>
                  <Text style={[
                    styles.themeButtonText, 
                    { 
                      color: theme === themeOption ? colors.accent : colors.textPrimary,
                      fontWeight: theme === themeOption ? '600' : '400'
                    }
                  ]}>
                    {themeOption === 'light' ? 'Light' : 
                     themeOption === 'dark' ? 'Dark' : 
                     'System'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Font Size Section */}
          <View style={[
            styles.card,
            { 
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
              shadowColor: isDarkMode ? '#000' : '#888',
              marginTop: 16,
            }
          ]}>
            <View style={styles.cardHeader}>
              <Ionicons 
                name="text-outline" 
                size={22} 
                color={colors.accent} 
                style={styles.cardIcon}
              />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Font Size
              </Text>
            </View>
            
            <View style={styles.fontSizeContainer}>
              {(['small', 'medium', 'large'] as const).map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.fontSizeButton,
                    { 
                      backgroundColor: fontSizeLevel === size 
                        ? colors.accent 
                        : isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
                    }
                  ]}
                  onPress={() => handleSetFontSize(size)}
                >
                  <Text style={{ 
                    fontSize: size === 'small' ? 14 : size === 'medium' ? 18 : 22,
                    color: fontSizeLevel === size ? '#fff' : colors.textPrimary,
                    fontWeight: fontSizeLevel === size ? '600' : '400',
                  }}>
                    A
                  </Text>
                  <Text style={[
                    styles.fontSizeLabel,
                    { 
                      color: fontSizeLevel === size ? '#fff' : colors.textSecondary,
                      fontWeight: fontSizeLevel === size ? '600' : '400',
                    }
                  ]}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Preview Section */}
          <View style={[
            styles.card,
            { 
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
              shadowColor: isDarkMode ? '#000' : '#888',
              marginTop: 16,
            }
          ]}>
            <View style={styles.cardHeader}>
              <Ionicons 
                name="eye-outline" 
                size={22} 
                color={colors.accent} 
                style={styles.cardIcon}
              />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Preview
              </Text>
            </View>
            
            <View style={styles.previewContainer}>
              <View style={[
                styles.previewBubble, 
                { 
                  backgroundColor: colors.bubbleSent,
                  alignSelf: 'flex-end',
                }
              ]}>
                <Text style={[
                  styles.previewText, 
                  { 
                    color: '#fff', 
                    fontSize: fontSize.normal 
                  }
                ]}>
                  This is how your messages will look
                </Text>
              </View>
              
              <View style={[
                styles.previewBubble, 
                { 
                  backgroundColor: colors.bubbleReceived,
                  alignSelf: 'flex-start',
                }
              ]}>
                <Text style={[
                  styles.previewText, 
                  { 
                    color: colors.textPrimary, 
                    fontSize: fontSize.normal
                  }
                ]}>
                  SimpleText will help you improve your writing
                </Text>
              </View>
            </View>
          </View>
          
          {/* Account Section */}
          <View style={[
            styles.card,
            { 
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#fff',
              shadowColor: isDarkMode ? '#000' : '#888',
              marginTop: 16,
            }
          ]}>
            <View style={styles.cardHeader}>
              <Ionicons 
                name="person-circle-outline" 
                size={22} 
                color={colors.accent} 
                style={styles.cardIcon}
              />
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Account
              </Text>
            </View>
            
            <View style={[
              styles.accountInfoContainer,
              {
                borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              }
            ]}>
              <View style={styles.accountItem}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={colors.textSecondary} 
                  style={styles.accountIcon}
                />
                <View>
                  <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>
                    Name
                  </Text>
                  <Text style={[styles.accountValue, { color: colors.textPrimary }]}>
                    {user?.name || 'User'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.accountItem}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={colors.textSecondary} 
                  style={styles.accountIcon}
                />
                <View>
                  <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>
                    Email
                  </Text>
                  <Text style={[styles.accountValue, { color: colors.textPrimary }]}>
                    {user?.email || 'user@example.com'}
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              SimpleText v1.0.0
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginTop: 0,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  themeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  themeButton: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  themeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  themeButtonText: {
    fontSize: 14,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  fontSizeButton: {
    width: '30%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  fontSizeLabel: {
    marginTop: 8,
    fontSize: 12,
  },
  previewContainer: {
    padding: 16,
  },
  previewBubble: {
    padding: 14,
    borderRadius: 18,
    marginBottom: 8,
    maxWidth: '80%',
  },
  previewText: {
    lineHeight: 20,
  },
  accountInfoContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  accountIcon: {
    marginRight: 12,
  },
  accountLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  accountValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,59,48,0.1)',
  },
  signOutText: {
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
  },
});

export default SettingsScreen; 