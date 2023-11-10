/* eslint-disable prettier/prettier */
import {View, Text, Image, StyleSheet, useWindowDimensions, ScrollView,Linking,SafeAreaView, Dimensions} from 'react-native';
import React, {useState,useEffect} from 'react';
import Logo from '../../../assets/images/star.png';
import CustomInput from '../../components/customInput/CustomInput';
import CustomButton from '../../components/customButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { WebView } from "react-native-webview";
import SafariView from "react-native-safari-view";
import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';

const SigninScreen = () => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const {height} = useWindowDimensions();
    const navigation = useNavigation();

    const onSignInPressed = () => {
      //validate user
      navigation.navigate('TabBarScreen');
    };
    const onSignUpPressed = () => {
      navigation.navigate('SignUp');
    };

      //... some other code here
  const [uri, setURL] = useState("");

  // Set up Linking
        useEffect(() => {
          Linking.addEventListener("url", (url) => handleOpenURL(url.url));
          Linking.getInitialURL().then((url) => {
            if (url) {
              handleOpenURL({ url });
            }
          });
          return () => {
            Linking.removeAllListeners("url");
          };
        }, []);

  const handleOpenURL = (url) => {
    console.log("TEST")
    // Extract stringified user string out of the URL
    const user = decodeURI(url).match(
      /firstName=([^#]+)\/lastName=([^#]+)\/email=([^#]+)/
    );
    // 2 - store data in Redux
    // const userData = {
    //   isAuthenticated: true,
    //   firstName: user[1],
    //   lastName: user[2],
    //   //some users on fb may not registered with email but rather with phone
    //   email: user && user[3] ? user[3] : "NA",
    // };
    // //redux function
    // login(userData);
    if (Platform.OS === "ios") {
      SafariView.dismiss();
    } else {
      setURL("");
    }
    onSignInPressed()
  };

  //method that opens a given url
  //based on the platform will use either SafariView or Linking
  //SafariView is a better practice in IOS
  const openUrl = (url) => {
    // // Use SafariView on iOS
    if (Platform.OS === "ios") {
      SafariView.show({
        url,
        fromBottom: true,
      });
    } else {
      setURL(url);
    }
  };
 //openUrl(`http://localhost:5500/api/auth/google/login`)
  return (
    <ScrollView>
      {uri !== "" ? (
        <SafeAreaView style={{ 
          flex: 1,
          width:windowWidth,
          height:windowHeight
        }}>
          <WebView
            userAgent={
              Platform.OS === "android"
                ? "Chrome/18.0.1025.133 Mobile Safari/535.19"
                : "AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75"
            }
            source={{ uri }}
          />
        </SafeAreaView>
      ) : (
      <View style={styles.root}>  
          <CustomButton
            width="45%"
            text="Google"
            type="google"
            icon="plus"
            //onPress={() => openUrl(`http://192.168.0.15:5500/api/auth/google/login`)}
            onPress={() => openUrl(`http://localhost:5500/api/auth/google/login`)}
          />
    </View>)}
    </ScrollView>
  );
};
{/* <Image
      source={Logo}
      style = {[styles.logo, {height: height * 0.3}]}
      resizeMode="contain" />
      <Text style={styles.text}>DOey</Text>
      <CustomInput placeholder="USERNAME" value={username} setValue={setUsername}/>
      <CustomInput placeholder="PASSWORD" value={password} setValue={setPassword} secureTextEntry={true}/>
      <CustomButton text="Sign in" onPress={onSignInPressed}/>
      <CustomButton text="Don't have an account? Create one" onPress={onSignUpPressed} type="tertiary" /> */}
const styles = StyleSheet.create({
    root: {
        flex:1,
        alignItems: 'center',
        padding: 50,
        backgroundColor: '#c4e3f5',
    },
    logo: {
        width: '70%',
        maxWidth: 500,
        maxHeight: 200,
        marginTop: 80,
    },
    text: {
      fontFamily: 'Cutive Mono',
      fontSize: 50,
      color:'black',
      marginBottom: 40,
    },
});

export default SigninScreen;

