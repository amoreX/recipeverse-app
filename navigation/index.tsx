import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SignInScreen from '../screens/SignInScreen';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import FavoritesScreen from '../screens/FavouritesScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

// Types
import type { RootStackParamList, MainTabParamList } from '../constants/types';
import { View } from 'react-native';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textDark,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="heart" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateRecipeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="plus" size={size} color={color} />,
        }}
      />
      {/* <Tab.Screen
        name="Create"
        component={CreateRecipeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <Feather name="plus" size={24} color={color} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}>
      <>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} />
      </>
    </Stack.Navigator>
  );
}
