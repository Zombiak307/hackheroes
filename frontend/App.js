/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {StyleSheet, Text, SafeAreaView} from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Navigation from './src/navigation';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'localhost:3000/graphql',
  cache: new InMemoryCache()
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={styles.root}>

        <Navigation style={styles.root} />

      </SafeAreaView>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,

    backgroundColor: '#c4e3f5',

  },
});

export default App;
