/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, View, Image, FlatList, ScrollView} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/customInput/CustomInput';
import taskstab from '../../../assets/data/taskstab';
import ShowTask from '../../components/ShowTask';
import { profiles } from '../../components/profiles';

const FriendsScreen = () => {

  const user = profiles[1];
  const { username, profilePic, myFriends } = user;
  const [search, setSearch] = useState('');
  return (
    <SafeAreaView style={styles.root}>
      <View>
      <View style={styles.container}>
          <CustomInput value={search} setValue={setSearch} placeholder="Search" />
        </View>
        <Image source={{ uri: profilePic }} style={styles.pic}/>
      </View>
      <View style={{marginBottom: 100}}>
        <FlatList
        data={taskstab}
        renderItem={({item}) => <ShowTask props={item} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#c4e3f5',
    paddingTop: 20,
  },
  container: {
    width: '80%',
    paddingLeft: 20,
    paddingTop: 20,
  },
  pic: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 100,
    position: 'absolute',
    right: 20,
    marginTop: 20,
  },
});

export default FriendsScreen;
