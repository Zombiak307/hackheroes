/* eslint-disable prettier/prettier */
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/customInput/CustomInput';
import CustomButton from '../../components/customButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUpScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const navigation = useNavigation();

    const onRegisterPressed = () => {
      //create account
      navigation.navigate('SignIn');
    };
    const onSignInPressed = () => {
      navigation.navigate('SignIn');
    };


  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Create an account</Text>
        <CustomInput placeholder="USERNAME" value={username} setValue={setUsername} style={{ width: '100%' }} />
        <CustomInput placeholder="EMAIL" value={email} setValue={setEmail} style={{ width: '100%' }} />
        <CustomInput placeholder="PASSWORD" value={password} setValue={setPassword} secureTextEntry={true} style={{ width: '100%' }} />
        <CustomInput placeholder="PASSWORD" value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry={true} style={{ width: '100%' }} />
        <CustomButton text="Register" onPress={onRegisterPressed}/>
        <CustomButton text="Already a user? Sign in here" onPress={onSignInPressed} type="tertiary" />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#c4e3f5',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      width: '100%'
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

