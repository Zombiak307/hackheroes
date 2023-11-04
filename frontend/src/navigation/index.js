/* eslint-disable prettier/prettier */
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SigninScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TabBarScreen from '../screens/TabBarScreen';
import AddTaskScreen from '../screens/AddTaskScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false,
          cardStyle: {
            flex: 1,
          },
        }}>
          <Stack.Group>
            <Stack.Screen name="SignIn" component={SigninScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </Stack.Group>
          <Stack.Group>
            <Stack.Screen name="TabBarScreen" component={TabBarScreen} />
            <Stack.Screen name="AddTaskScreen" component={AddTaskScreen} />
          </Stack.Group>
        </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  root: {
      flex: 1,
      backgroundColor: '#c5e3f5',
  },
});

export default Navigation;
