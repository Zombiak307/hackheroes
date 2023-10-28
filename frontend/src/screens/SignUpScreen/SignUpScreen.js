/* eslint-disable prettier/prettier */
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/customInput/CustomInput';
import CustomButton from '../../components/customButton/CustomButton';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const navigation = useNavigation();

    const onRegisterPressed = () => {
      console.warn('Register');
      //validate
      navigation.navigate('Home');
    };
    const onSignInPressed = () => {
      console.warn('Sign in');
      navigation.navigate('SignIn');
    };


  return (
    <ScrollView>
    <View style={styles.root}>
      <Text style={styles.title}>Create an account</Text>
      <CustomInput placeholder="USERNAME" value={username} setValue={setUsername}/>
      <CustomInput placeholder="EMAIL" value={email} setValue={setEmail}/>
      <CustomInput placeholder="PASSWORD" value={password} setValue={setPassword} secureTextEntry={true}/>
      <CustomInput placeholder="PASSWORD" value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry={true}/>
      <CustomButton text="Register" onPress={onRegisterPressed}/>
      <CustomButton text="Already a user? Sign in here" onPress={onSignInPressed} type="tertiary" />

    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#c4e3f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color:'black',
      margin: 20,
      paddingVertical: 20,
    },
});

export default SignUpScreen;

