/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, View, Image, FlatList, ScrollView} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/customInput/CustomInput';
import taskstab from '../../../assets/data/taskstab';
import ShowTask from '../../components/ShowTask';
import { profiles } from '../../components/profiles';

const user = profiles[0];
const { username, profilePic, myFriends } = user;
let friends = [];
myFriends.forEach((el)=> {
  friends.push(el.friend);
})

let tasks = [];
taskstab.forEach((element) => {
  friends.forEach((el) => {
    if (element.user === el){
      let memo ={};
      memo["user"] = element.user;
      memo["name"] = element.name;
      memo["status"] = element.status;
      memo['image'] = element.image;
      tasks.push(memo);
    };
  })
});

const FriendsScreen = () => {

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
        data={tasks}
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
    width: '70%',
    paddingLeft: 20,
    paddingTop: 20,
    marginBottom: 20,
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
