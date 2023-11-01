/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import { View, Text } from 'react-native';
import React from 'react';
import FriendsScreen from '../FriendsScreen';
import MyTasksScreen from '../MyTasksScreen';
import ProfileScreen from '../ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function TabBarScreen() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName={'Friends'}
        screenOptions={{
          headerShown: false
        }}
        options={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'grey',
          labelStyle: { paddingBottom: 10, fontSize: 10 },
          style: { padding: 10, height: 70},
        }}>
          <Tab.Screen
            name="Friends"
            component={FriendsScreen}
            options={{
              tabBarLabel: 'Friends',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="star-shooting-outline" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="MyTasks"
            component={MyTasksScreen}
            options={{
              tabBarLabel: 'Tasks',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="calendar-check" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account-circle" color={color} size={size} />
              ),
            }}
          />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
