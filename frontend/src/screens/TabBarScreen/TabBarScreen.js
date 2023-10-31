/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import { View, Text } from 'react-native';
import React from 'react';
import FriendsScreen from '../FriendsScreen';
import MyTasksScreen from '../MyTasksScreen';
import ProfileScreen from '../ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function TabBarScreen() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName={'Friends'}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name == 'Friends') {
              iconName = 'wifi';
            } else if (route.name == 'MyTasks') {
              iconName = 'trophy';
            } else if (route.name == 'Profile') {
              iconName = 'timelapse';
            }
            console.log(iconName)
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        options={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'grey',
          labelStyle: { paddingBottom: 10, fontSize: 10 },
          style: { padding: 10, height: 70},
        }}>
          <Tab.Screen name="Friends" component={FriendsScreen} />
          <Tab.Screen name="MyTasks" component={MyTasksScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
