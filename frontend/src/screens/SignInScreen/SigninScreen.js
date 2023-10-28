/* eslint-disable prettier/prettier */
import {View, Text, Image, StyleSheet, useWindowDimensions, ScrollView} from 'react-native';
import React, {useState} from 'react';
import Logo from '../../../assets/images/star.png';
import CustomInput from '../../components/customInput/CustomInput';
import CustomButton from '../../components/customButton/CustomButton';
import { useNavigation } from '@react-navigation/native';

const SigninScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const {height} = useWindowDimensions();
    const navigation = useNavigation();

    const onSignInPressed = () => {
      console.warn('Sign in');
      //validate user
      navigation.navigate('Home');
    };
    const onSignUpPressed = () => {
      console.warn('Sign up');
      navigation.navigate('SignUp');
    };
  return (
    <ScrollView>
    <View style={styles.root}>
      <Image
      source={Logo}
      style = {[styles.logo, {height: height * 0.3}]}
      resizeMode="contain" />
      <Text style={styles.text}>DOey</Text>
      <CustomInput placeholder="USERNAME" value={username} setValue={setUsername}/>
      <CustomInput placeholder="PASSWORD" value={password} setValue={setPassword} secureTextEntry={true}/>
      <CustomButton text="Sign in" onPress={onSignInPressed}/>
      <CustomButton text="Don't have an account? Create one" onPress={onSignUpPressed} type="tertiary" />
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 50,
        backgroundColor: '#c4e3f5',
    },
    logo: {
        width: '70%',
        maxWidth: 500,
        maxHeight: 200,
        marginTop: 30,
    },
    text: {
      fontFamily: 'Cutive Mono',
      fontSize: 50,
      color:'black',
      marginBottom: 40,
    },
});

export default SigninScreen;

