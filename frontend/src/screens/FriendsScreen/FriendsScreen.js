/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, View, Image, FlatList, ScrollView} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/customInput/CustomInput';
import taskstab from '../../../assets/data/taskstab';
import ShowTask from '../../components/ShowTask';

const FriendsScreen = () => {
  const [search, setSearch] = useState('');
  return (
    <View style={styles.root}>
      <View>
        <View style={styles.container}>
          <CustomInput value={search} setValue={setSearch} placeholder="Search" />
        </View>
        <Image
          source={{uri: 'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvZnJob3JzZV9nYWxsb3BfY2FudGVyX21hcmUtaW1hZ2Utcm01MDNfMS1sMDd0dW5iZy5qcGc.jpg'}}
          style={styles.pic}/>
      </View>
      <View style={{marginBottom: 100}}>
        <FlatList
        data={taskstab}
        renderItem={({item}) => <ShowTask props={item} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#c4e3f5',
    paddingTop: 20,
  },
  container: {
    width: '75%',
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  pic: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderWidth: 2,
    borderColor: '#4d5d94',
    borderRadius: 50,
    position: 'absolute',
    right: 10,
    marginTop: 12,
  },
});

export default FriendsScreen;
