/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';

const CustomButton = ({ onPress, text, type }) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, styles[`container_${type}`]]}>
      <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1583c2',
        width: '100%',
        padding: 15,
        marginVertical: 5,
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 5,
        borderColor: '#244b61',
    },
    container_tertiary: {
        backgroundColor: '#c4e3f5',
    },
    text: {
        fontWeight: 'bold',
        color: 'white',
    },
    text_tertiary: {
        color: 'grey',
    },
});

export default CustomButton;