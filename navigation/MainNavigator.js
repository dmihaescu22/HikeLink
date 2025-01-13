import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreScreen from '../screens/ExploreScreen';
import { Image } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

import feedIcon from '../assets/icons/feed.png';
import activityIcon from '../assets/icons/activity.png';
import exploreIcon from '../assets/icons/explore.png';
import badgesIcon from '../assets/icons/badges.png';
import profileIcon from '../assets/icons/profile.png';

const Tab = createBottomTabNavigator();

export default function MainNavigator({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Auth'); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;
          switch (route.name) {
            case 'Feed':
              iconSource = feedIcon;
              break;
            case 'Activity':
              iconSource = activityIcon;
              break;
            case 'Explore':
              iconSource = exploreIcon;
              break;
            case 'Badges':
              iconSource = badgesIcon;
              break;
            case 'Profile':
              iconSource = profileIcon;
              break;
            default:
              iconSource = exploreIcon;
          }
          return (
            <Image
              source={iconSource}
              style={{ width: 24, height: 24, tintColor: focused ? '#556B2F' : '#888' }}
            />
          );
        },
        tabBarStyle: { height: 60 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Feed" component={ExploreScreen} />
      <Tab.Screen name="Activity" component={ExploreScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Badges" component={ExploreScreen} />
      <Tab.Screen
        name="Profile"
        component={ExploreScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); 
            handleLogout(); 
          },
        }}
      />
    </Tab.Navigator>
  );
}
