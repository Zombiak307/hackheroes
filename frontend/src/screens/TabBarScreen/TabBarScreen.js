/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import { View, Text } from 'react-native';
import React from 'react';
import FriendsScreen from '../FriendsScreen';
import MyTasksScreen from '../MyTasksScreen';
import ProfileScreen from '../ProfileScreen';
import EditProfileScreen from '../EditProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


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
            component={ProfileStackScreen}
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

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = ({navigation}) => (
  <ProfileStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#f0f0f0',
    },
    headerTintColor: "#000",
    headerTitleStyle: {
      fontFamily: 'Cutive Mono',
      fontSize: 27,
    }
  }}>
    <ProfileStack.Screen
      name = 'Profile'
      component = {ProfileScreen} 
      options = {{
        title: 'Profile',
        headerRight: () => (
          <MaterialCommunityIcons.Button
            name = 'account-edit'
            size = {27}
            backgroundColor = '#f0f0f0'
            color = "#000"
            onPress = {() => navigation.navigate('EditProfile')}
          />
        ),
      }}
    />
    <ProfileStack.Screen
      name = 'EditProfile'
      options = {{
        title: 'Edit profile'
      }}
      component = {EditProfileScreen}
    />
  </ProfileStack.Navigator>
);
