/* eslint-disable prettier/prettier */
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SigninScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TabBarScreen from '../screens/TabBarScreen';
import linking from "../linking.js";
const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName="login" screenOptions={{
          headerShown: false,
          cardStyle: {
            flex: 1,
          },
        }}>
            <Stack.Screen name="login" component={SigninScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="TabBarScreen" component={TabBarScreen} />
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
