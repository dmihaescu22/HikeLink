import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreScreen from '../screens/ExploreScreen';
import { Image } from 'react-native';

// Importăm PNG-urile pentru tab-uri
import feedIcon from '../assets/icons/feed.png';
import activityIcon from '../assets/icons/activity.png';
import exploreIcon from '../assets/icons/explore.png';
import badgesIcon from '../assets/icons/badges.png';
import profileIcon from '../assets/icons/profile.png';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Ascunde header-ul din toate paginile tab-ului
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
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#556B2F',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Feed" component={ExploreScreen} />
      <Tab.Screen name="Activity" component={ExploreScreen} />
      <Tab.Screen name="Badges" component={ExploreScreen} />
      <Tab.Screen name="Profile" component={ExploreScreen} />
    </Tab.Navigator>
  );
}
