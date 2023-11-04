/* eslint-disable prettier/prettier */
import { SafeAreaView, StyleSheet, View, Image, FlatList, ScrollView} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/customInput/CustomInput';
import taskstab from '../../../assets/data/taskstab';
import ShowTask from '../../components/ShowTask';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FriendsScreen = () => {
  const [search, setSearch] = useState('');
  return (
    <View style={styles.root}>
      <View>
        <View style={styles.container}>
          <CustomInput value={search} setValue={setSearch} placeholder="Search" />
        </View>
        <MaterialCommunityIcons name='human-greeting-variant' size={60} color={'#395f75'} style={styles.pic} />
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
    width: '80%',
    paddingLeft: 20,
    paddingTop: 20,
  },
  pic: {
    position: 'absolute',
    right: 20,
    marginTop: 20,
  },
});

export default FriendsScreen;
