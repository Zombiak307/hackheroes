import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { profiles } from '../../components/profiles';import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EditProfileScreen =  () => {

    const user = profiles[0];
    const { username, profilePic, myFriends } = user;



    return (
        <SafeAreaView style = {styles.root}>
            
            <View style = {{margin: 20}}>
                <View style = {{alignItems: 'center'}}>
                    <TouchableOpacity onPress = {() => {}}>
                        <View style = {{
                            height: 100,
                            width: 100,
                            borderRadius: 15,
                            ustifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <ImageBackground source={{ uri: profilePic }} style={{height: 100, width: 100}}
                            imageStyle = {{borderRadius: 15}}
                            >
                                <View style = {{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Icon name = "camera" size = {35} color = "black" style = {{
                                        opacity: 0.7,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: 'black',
                                        borderRadius: 10,
                                    }}
                                    />
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.user}>@{username}</Text>
                </View>
                <TouchableOpacity style = {styles.commandButton} onPress = {() => {}}>
                    <Text style = {{fontStyle: 'italic'}}>Submit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1,

        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c4e3f5',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pic: {
        marginTop: 50,
        padding: 100,
        width: 170,
        height: 170,
        aspectRatio: 1,
        resizeMode: 'contain',
        borderRadius: 200,
    },
    user :{
        fontFamily: 'Cutive Mono',
        fontSize: 30,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 40,
        color:'black',
    },
    commandButton :{
        padding: 5,
        borderRadius: 20,
        borderColor: 'black',
        backgroundColor: '#c4e3f5',
        borderWidth: 2,
        alignItems: 'center',
        marginTop: 10,
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
});



