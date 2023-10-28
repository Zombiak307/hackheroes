/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {StyleSheet, Text, SafeAreaView} from 'react-native';

import SigninScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import Navigation from './src/navigation';


const App = () => {
  return (
    <SafeAreaView style={styles.root}>

      <Navigation style={styles.root}/>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,

    backgroundColor: '#c4e3f5',

  },
});

export default App;
