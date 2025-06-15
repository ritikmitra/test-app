import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Profile from './Profile';
import Settings from './Settings';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/color';


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'Settings') iconName = 'settings';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Remove ripple effect
        tabBarButton: ({ children, onPress, accessibilityState, style }) => (
          <TouchableOpacity
            onPress={onPress}
            onPressIn={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft) }}
            activeOpacity={1}
            style={style}
            accessibilityState={accessibilityState}
          >
            {children}
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen name="Home"  component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
