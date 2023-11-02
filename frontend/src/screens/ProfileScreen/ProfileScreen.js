import {View, Text, StyleSheet, ScrollView, Image, FlatList} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/customInput/CustomInput';
import CustomButton from '../../components/customButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { profiles } from '../../components/profiles';
import { Dimensions } from 'react-native';

const FriendsList = ({ friends }) => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.friend}>@{item.friend}</Text>
    </View>
  );

  return (
    <FlatList
      data={friends}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

const windowWidth = Dimensions.get('window').width -30;


const ProfileScreen = () => {

  const user = profiles[0];
  const { username, profilePic, myFriends } = user;
  
  return (
    <SafeAreaView style={styles.root}>
        <View>
            <Image source={{ uri: profilePic }} style={styles.pic}/>
          <Text style={styles.user}>@{username}</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}> My Friends:</Text>
          <FriendsList friends={myFriends} />
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#c4e3f5',
    },
    user :{
        fontFamily: 'Cutive Mono',
        fontSize: 30,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 40,
        color:'black',
    },
    container: {
      padding: 10,
      resizeMode: 'contain',
      backgroundColor: '#f0f0f0',
      flex: 1,
      width: windowWidth,
      borderRadius: 10,
      
      
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      color:'black',
      marginTop: 10,
      marginBottom: 20,
      fontFamily: 'Cutive Mono',
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
    friend: {
      fontFamily: 'Cutive Mono',
      fontSize: 25,
      marginBottom: 20,
    }
});

export default ProfileScreen;