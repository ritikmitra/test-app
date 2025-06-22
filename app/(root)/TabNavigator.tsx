import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Settings from './Settings';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/color';
import { useRef, useEffect } from 'react';
import Admin from './Admin';
import { useAuth } from '@/contexts/AuthContexts';
import UserListScreen from './UserList';

const Tab = createBottomTabNavigator();

// Custom Tab Button Component
const CustomTabButton = ({ children, onPress, accessibilityState }: any) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const isSelected = accessibilityState?.selected;


  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: isSelected ? 1.1 : 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  }, [isSelected, scaleValue]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(scaleValue, {
        toValue: isSelected ? 1.1 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();

    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={styles.customButton}
      accessibilityState={accessibilityState}
    >
      <Animated.View
        style={[
          styles.buttonContent,
          { transform: [{ scale: scaleValue }] }
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const TabNavigator = () => {
  const { userRole } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: [
          styles.tabBar,
          {
            bottom: 20,
            paddingBottom: 0,
          }
        ],
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,

        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
          else if (route.name === 'Admin') iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          else if (route.name === 'Chats') iconName = focused ? 'chatbox' : 'chatbox-outline';

          return (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Ionicons name={iconName} size={24} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          );
        },

        tabBarButton: ({ children, onPress, accessibilityState }) => (
          <CustomTabButton
            onPress={onPress}
            accessibilityState={accessibilityState}
          >
            {children}
          </CustomTabButton>
        ),
      })}
    >
      <Tab.Screen name="Home" component={Home}  />
      <Tab.Screen name="Settings" component={Settings} />
      {
        userRole === "ADMIN" && <Tab.Screen name="Admin" component={Admin} />
      }
      <Tab.Screen name='Chats' component={UserListScreen}/>

    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    marginHorizontal: 20,
    height: 70,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowRadius: 20,
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  customButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingVertical: 8,
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'relative',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    transform: [{ scale: 1.1 }],
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
});

export default TabNavigator;