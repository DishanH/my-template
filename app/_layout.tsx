import { FontAwesome5 } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { SettingsProvider, useSettings } from "../context/SettingsContext";
import { ThemeProvider } from "../context/ThemeContext";
import SignInScreen from "./auth/signin";
import SignUpScreen from "./auth/signup";
import { BottomSheetProvider } from "./components/BottomSheetProvider";
import { storage } from "./utils/storage";

// Create stack navigator for auth flow
const Stack = createNativeStackNavigator();

// Authentication navigator
const AuthNavigator = () => {
  const { colors } = useSettings();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.accent,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="SignIn" 
        component={SignInScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Custom drawer content component
function CustomDrawerContent(props: any) {
  const { colors } = useSettings();
  const { signOut } = useAuth();

  // Determine current route name to highlight active drawer item
  const currentRouteName = props.state.routes[props.state.index]?.name || "";

  return (
    <View
      style={[
        styles.drawerContainer,
        { backgroundColor: colors.background },
      ]}
    >
      {/* User Profile Section with background box */}
      <View
        style={[
          styles.profileBox,
          {
            backgroundColor: colors.bubbleReceived,
            borderColor: colors.textSecondary + '20',
          },
        ]}
      >
        <View style={styles.userSection}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={[styles.userName, { color: colors.textPrimary }]}>John Doe</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            john.doe@example.com
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.drawerContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "tabs" || currentRouteName === "index"
                  ? colors.bubbleReceived
                  : "transparent",
            },
          ]}
          onPress={() => props.navigation.navigate("tabs")}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="tachometer-alt"
              size={20}
              color={currentRouteName === "tabs" || currentRouteName === "index" ? colors.accent : colors.textSecondary}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "tabs" || currentRouteName === "index" ? colors.accent : colors.textPrimary,
                fontWeight: currentRouteName === "tabs" || currentRouteName === "index" ? "600" : "500",
              },
            ]}
          >
            Dashboard
          </Text>
          {(currentRouteName === "tabs" || currentRouteName === "index") && (
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: colors.accent },
              ]}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "groups"
                  ? colors.bubbleReceived
                  : "transparent",
            },
          ]}
          onPress={() => props.navigation.navigate("groups")}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="users"
              size={20}
              color={currentRouteName === "groups" ? colors.accent : colors.textSecondary}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "groups" ? colors.accent : colors.textPrimary,
                fontWeight: currentRouteName === "groups" ? "600" : "500",
              },
            ]}
          >
            Groups
          </Text>
          {currentRouteName === "groups" && (
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: colors.accent },
              ]}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "activity"
                  ? colors.bubbleReceived
                  : "transparent",
            },
          ]}
          onPress={() => props.navigation.navigate("activity")}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="history"
              size={20}
              color={currentRouteName === "activity" ? colors.accent : colors.textSecondary}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "activity" ? colors.accent : colors.textPrimary,
                fontWeight: currentRouteName === "activity" ? "600" : "500",
              },
            ]}
          >
            Activity
          </Text>
          {currentRouteName === "activity" && (
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: colors.accent },
              ]}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "settings"
                  ? colors.bubbleReceived
                  : "transparent",
            },
          ]}
          onPress={() => props.navigation.navigate("settings")}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="cog"
              size={20}
              color={currentRouteName === "settings" ? colors.accent : colors.textSecondary}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "settings" ? colors.accent : colors.textPrimary,
                fontWeight: currentRouteName === "settings" ? "600" : "500",
              },
            ]}
          >
            Settings
          </Text>
          {currentRouteName === "settings" && (
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: colors.accent },
              ]}
            />
          )}
        </TouchableOpacity>
        
        <View style={[styles.divider, { backgroundColor: colors.textSecondary + '20' }]} />
        
        <TouchableOpacity
          style={[
            styles.drawerItem,
          ]}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="question-circle"
              size={18}
              color={colors.textSecondary}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Help & Feedback
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sign Out Button */}
      <TouchableOpacity 
        style={[
          styles.signOutButton,
          { backgroundColor: colors.bubbleReceived }
        ]}
        onPress={() => {
          props.navigation.closeDrawer();
          setTimeout(() => {
            signOut();
          }, 300);
        }}
      >
        <FontAwesome5
          name="sign-out-alt"
          size={18}
          color="#FF3B30"
          style={styles.signOutIcon}
        />
        <Text style={[styles.signOutText, { color: "#FF3B30" }]}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Custom Drawer Toggle Button with circular background
function CustomDrawerToggle(props: any) {
  const { colors } = useSettings();

  return (
    <View
      style={[
        styles.toggleButtonContainer,
        { backgroundColor: colors.background },
      ]}
    >
      <DrawerToggleButton {...props} tintColor={colors.textPrimary} />
    </View>
  );
}

// Main app component that handles authentication state
function AppContent({ initialRoute }: { initialRoute: string }) {
  const { user, isLoading } = useAuth();
  const { isDarkMode, colors } = useSettings();
  
  // Set initial route when component mounts
  useEffect(() => {
    // Don't redirect if auth is still loading
    if (isLoading) return;
    
    if (initialRoute === '/onboarding') {
      router.replace('/onboarding' as any);
    } else if (!user) {
      // Only redirect to auth if not authenticated
      // The AuthNavigator will be rendered instead
    } else if (user && initialRoute === '/') {
      // If authenticated and initial route is root, go to tabs
      router.replace('/tabs' as any);
    }
  }, [initialRoute, user, isLoading]);

  // Show loading while checking auth
  if (isLoading) {
    return null;
  }

  // Show auth navigator if not authenticated
  if (!user) {
    return (
      <>
        <StatusBar style={isDarkMode ? "light" : "dark"} backgroundColor="transparent" translucent={true} />
        <AuthNavigator />
      </>
    );
  }

  // Show main app if authenticated
  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} backgroundColor="transparent" translucent={true} />
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ route }) => ({
          headerShown: true,
          headerTitle: route.name !== 'index' && route.name !== 'tabs' ? route.name.charAt(0).toUpperCase() + route.name.slice(1) : "",
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            color: colors.textPrimary,
          },
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
            borderBottomWidth: 0,
            height: Platform.OS === 'ios' ? 80 : 60,
          },
          headerShadowVisible: false,
          drawerType: "slide",
          drawerStyle: {
            width: "75%",
            backgroundColor: colors.background,
          },
          swipeEdgeWidth: 50,
          headerLeft: (props) => <CustomDrawerToggle {...props} />,
        })}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="tabs"
          options={{
            drawerLabel: "Dashboard",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="groups"
          options={{
            drawerLabel: "Groups",
            drawerIcon: ({ color }) => (
              <FontAwesome5 name="users" size={20} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="activity"
          options={{
            drawerLabel: "Activity",
            drawerIcon: ({ color }) => (
              <FontAwesome5 name="history" size={20} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            drawerIcon: ({ color }) => (
              <FontAwesome5 name="cog" size={20} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="onboarding"
          options={{
            drawerLabel: "Onboarding",
            drawerItemStyle: { display: 'none' },  // Hide from drawer
            headerShown: false,  // Hide header on onboarding screen
          }}
        />
      </Drawer>
    </>
  );
}

// Export the root layout wrapped with providers
export default function RootLayout() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  // Check onboarding status from storage when component mounts
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingStatus = await storage.getOnboardingStatus();
        setIsOnboardingComplete(onboardingStatus);
        
        if (!onboardingStatus) {
          setInitialRoute('/onboarding');
        } else {
          setInitialRoute('/');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsOnboardingComplete(false);
        setInitialRoute('/onboarding');
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Show a loading state while checking onboarding status
  if (isLoading || !initialRoute) {
    return null;
  }

  return (
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <BottomSheetProvider>
            <AppContent initialRoute={initialRoute} />
          </BottomSheetProvider>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  toggleButtonContainer: {
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  drawerContainer: {
    flex: 1,
    paddingTop: 20,
  },
  userSection: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.8,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    position: "relative",
  },
  drawerIconContainer: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerItemText: {
    fontSize: 16,
  },
  activeIndicator: {
    position: "absolute",
    left: 0,
    top: 12,
    bottom: 12,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 16,
    borderRadius: 10,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "500",
  },
  signOutIcon: {
    marginRight: 16,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 16,
    opacity: 0.5,
  },
  profileBox: {
    margin: 16,
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderRadius: 16,
  },
});
